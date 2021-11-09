import React, {
  Component, useEffect, useState, useRef
} from 'react';
import PropTypes from 'prop-types';
import Promise from 'promise';

export default function StepZilla(props) {
  const [compState, setCompState] = useState(props.startAtStep);
  const [navState, setNavState] = useState(null);

  const hidden = {
    display: 'none'
  };

  useEffect(() => {
    setNavState(getNavStates(props.startAtStep, props.steps.length));
  }, []);

  // update the header nav states via classes so they can be styled via css
  const getNavStates = (indx, length) => {
    const styles = [];

    for (let i = 0; i < length; i++) {
      if (i < indx || (!props.prevBtnOnLastStep && (indx === length - 1))) {
        styles.push('done');
      } else if (i === indx) {
        styles.push('doing');
      } else {
        styles.push('todo');
      }
    }

    return { styles };
  };

  const getPrevNextBtnLayout = (currentStep) => {
    // first set default values
    let showPreviousBtn = true;
    let showNextBtn = true;
    let nextStepText = props.nextButtonText;

    // first step hide previous btn
    if (currentStep === 0) {
      showPreviousBtn = false;
    }

    // second to last step change next btn text if supplied as props
    if (currentStep === props.steps.length - 2) {
      // if user did not give a custom nextTextOnFinalActionStep, the nextButtonText becomes the default
      const nextTextOnFinalActionStep = (props.nextTextOnFinalActionStep) ? props.nextTextOnFinalActionStep : props.nextButtonText;
      nextStepText = nextTextOnFinalActionStep || nextStepText;
    }

    // last step hide next btn, hide previous btn if supplied as props
    if (currentStep >= props.steps.length - 1) {
      showNextBtn = false;
      showPreviousBtn = props.prevBtnOnLastStep === false ? false : true;
    }

    return {
      showPreviousBtn,
      showNextBtn,
      nextStepText
    };
  };

  // which step are we in?
  const checkNavState = (nextStep) => {
    if (props.onStepChange) {
      props.onStepChange(nextStep);
    }
  };

  // set the nav state
  const adjustNavState = (next) => {
    setNavState(getNavStates(next, props.steps.length));

    if (next < props.steps.length) {
      setCompState(next);
    }

    checkNavState(next);
  };

  // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next (ignore textareas as they should allow line breaks)
  const handleKeyDown = (evt) => {
    if (evt.which === 13) {
      if (!props.preventEnterSubmission && evt.target.type !== 'textarea') {
        next();
      } else if (evt.target.type !== 'textarea') {
        evt.preventDefault();
      }
    }
  };

  // this utility method lets Child components invoke a direct jump to another step
  const jumpToStep = (evt) => {
    if (typeof evt.target === 'undefined') {
      // a child step wants to invoke a jump between steps. in this case 'evt' is the numeric step number and not the JS event
      adjustNavState(evt);
    } else { // the main navigation step ui is invoking a jump between steps
      // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore
      if (!props.stepsNavigation || evt.target.value === compState) {
        evt.preventDefault();
        evt.stopPropagation();

        return;
      }

      // evt is a react event so we need to persist it as we deal with aync promises which nullifies these events (https://facebook.github.io/react/docs/events.html#event-pooling)
      evt.persist();

      const movingBack = evt.target.value < compState; // are we trying to move back or front?
      let passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...
      let proceed = false; // flag on if we should move on

      abstractStepMoveAllowedToPromise(movingBack)
        .then((valid) => {
          // validation was a success (promise or sync validation). In it was a Promise's resolve()
          // ... then proceed will be undefined, so make it true. Or else 'proceed' will carry the true/false value from sync
          proceed = typeof valid === 'undefined' ? true : valid;

          if (!movingBack) {
            updateStepValidationFlag(proceed);
          }

          if (proceed) {
            if (!movingBack) {
              // looks like we are moving forward, 'reduce' a new array of step>validated values we need to check and
              // ... 'some' that to get a decision on if we should allow moving forward
              passThroughStepsNotValid = props.steps
                .reduce((a, c, i) => {
                  if (i >= compState && i < evt.target.value) {
                    a.push(c.validated);
                  }
                  return a;
                }, [])
                .some((c) => {
                  return c === false;
                });
            }
          }
        })
        .catch(() => {
          // Promise based validation was a fail (i.e reject())
          if (!movingBack) {
            updateStepValidationFlag(false);
          }
        })
        .then(() => {
          // this is like finally(), executes if error no no error
          if (proceed && !passThroughStepsNotValid) {
            if (evt.target.value === (props.steps.length - 1)
              && compState === (props.steps.length - 1)) {
              adjustNavState(props.steps.length);
            } else {
              adjustNavState(evt.target.value);
            }
          }
        })
        .catch(e => {
          if (e) {
            // see note below called "CatchRethrowing"
            // ... plus the finally then() above is what throws the JS Error so we need to catch that here specifically
            setTimeout(() => { throw e; });
          }
        });
    }
  };

  // move next via next button
  const next = () => {
    abstractStepMoveAllowedToPromise()
      .then((proceed = true) => {
        // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined,
        // ... so make it true. Or else 'proceed' will carry the true/false value from sync validation
        updateStepValidationFlag(proceed);

        if (proceed) {
          adjustNavState(compState + 1);
        }
      })
      .catch((e) => {
        if (e) {
          // CatchRethrowing: as we wrap StepMoveAllowed() to resolve as a Promise, the then() is invoked and the next React Component is loaded.
          // ... during the render, if there are JS errors thrown (e.g. ReferenceError) it gets swallowed by the Promise library and comes in here (catch)
          // ... so we need to rethrow it outside the execution stack so it behaves like a notmal JS error (i.e. halts and prints to console)
          //
          setTimeout(() => { throw e; });
        }

        // Promise based validation was a fail (i.e reject())
        updateStepValidationFlag(false);
      });
  };

  // move behind via previous button
  const previous = () => {
    if (compState > 0) {
      adjustNavState(compState - 1);
    }
  };

  // update step's validation flag
  const updateStepValidationFlag = (val = true) => {
    props.steps[compState].validated = val; // note: if a step component returns 'underfined' then treat as "true".
  };

  const activeComponentRef = useRef(null);

  // are we allowed to move forward? via the next button or via jumpToStep?
  const stepMoveAllowed = (skipValidationExecution = false) => {
    let proceed = false;

    if (props.dontValidate) {
      proceed = true;
    } else {
      if (skipValidationExecution) {
        // we are moving backwards in steps, in this case dont validate as it means the user is not commiting to "save"
        proceed = true;
      } else if (isStepAtIndexHOCValidationBased(compState)) {
        // the user is using a higer order component (HOC) for validation (e.g react-validation-mixin), this wraps the StepZilla steps as a HOC,
        // so use hocValidationAppliedTo to determine if this step needs the aync validation as per react-validation-mixin interface
        proceed = activeComponentRef.current.refs.component.isValidated();
      } else if (activeComponentRef.current === null || typeof activeComponentRef.current.isValidated === 'undefined') {
        // if its a form component, it should have implemeted a public isValidated class (also pure componenets wont even have refs - i.e. a empty object). If not then continue
        proceed = true;
      } else {
        // user is moving forward in steps, invoke validation as its available
        proceed = activeComponentRef.current.isValidated();
      }
    }

    return proceed;
  };

  const isStepAtIndexHOCValidationBased = (stepIndex) => {
    return (props.hocValidationAppliedTo && props.hocValidationAppliedTo.length > 0 && props.hocValidationAppliedTo.indexOf(stepIndex) > -1);
  };

  // a validation method is each step can be sync or async (Promise based), this utility abstracts the wrapper stepMoveAllowed to be Promise driven regardless of validation return type
  const abstractStepMoveAllowedToPromise = (movingBack) => {
    return Promise.resolve(stepMoveAllowed(movingBack));
  };

  // get the classmame of steps
  const getClassName = (className, i) => {
    let liClassName = '';

    if (navState && navState.styles) {
      liClassName = `${className}-${navState.styles[i]}`;

      // if step ui based navigation is disabled, then dont highlight step
      if (!props.stepsNavigation) {
        liClassName += ' no-hl';
      }
    }

    return liClassName;
  };

  // render the steps as stepsNavigation
  const renderSteps = () => {
    const pointerEventsNone = { pointerEvents: 'none' };
    return props.steps.map((s, i) => (
      <li className={getClassName('progtrckr', i)} onClick={(evt) => { jumpToStep(evt); }} key={i} value={i}>
          <em style={pointerEventsNone}>{i + 1}</em>
          <span style={pointerEventsNone}>{props.steps[i].name}</span>
      </li>
    ));
  };

  const { nextStepText, showNextBtn, showPreviousBtn } = getPrevNextBtnLayout(compState);

  // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
  const cloneExtensions = {
    jumpToStep: (t) => {
      jumpToStep(t);
    }
  };

  let componentPointer = null;
  let compToRender = null;

  if (props.steps[compState]) {
    componentPointer = props.steps[compState].component;

    // S: ref binding -----
    // we need to bind a ref to it so we can use the imperitive "isValidated" method when needed to prevent navigation
    // ... we only can do this if its a (1) React Class based component or (2) A Hooks based stateful component wrapped in forwardRef

    // (1) can only update refs if its a regular React component (not a pure component - i.e. function components with no state), so lets check that
    if (componentPointer instanceof Component
      || (componentPointer.type && componentPointer.type.prototype instanceof Component)) {
      // unit test deteceted that instanceof Component can be in either of these locations so test both (not sure why this is the case)
      cloneExtensions.ref = activeComponentRef;
    } else {
      // (2) after react hooks was released, functional components can have state and therefore support refs
      // ... we do this via forwardRefs. So we need to support this as well
      // ... after testing, if both the below types are objects then it's a hooks function component wrapped in forwardRef
      if (typeof componentPointer === 'object' && typeof componentPointer.type === 'object') {
        cloneExtensions.ref = activeComponentRef;
      }
    }
    // E: ref binding -----

    compToRender = React.cloneElement(componentPointer, cloneExtensions);
  }

  // main render of stepzilla container
  return (
    <div className="multi-step" onKeyDown={(evt) => { handleKeyDown(evt); }}>
        {
            props.showSteps
              ? <ol className="progtrckr">
                  {renderSteps()}
              </ol>
              : <span></span>
        }

        {compToRender}
      <div style={props.showNavigation ? {} : hidden} className="footer-buttons">
        <button
          type="button"
          style={showPreviousBtn ? {} : hidden}
          className={props.backButtonCls}
          onClick={() => { previous(); }}
          id="prev-button"
        >
          {props.backButtonText}
        </button>
        <button
          type="button"
          style={showNextBtn ? {} : hidden}
          className={props.nextButtonCls}
          onClick={() => { next(); }}
          id="next-button"
        >
          {nextStepText}
        </button>
      </div>
   </div>
  );
}

StepZilla.defaultProps = {
  showSteps: true,
  showNavigation: true,
  stepsNavigation: true,
  prevBtnOnLastStep: true,
  dontValidate: false,
  preventEnterSubmission: false,
  startAtStep: 0,
  nextButtonText: 'Next',
  nextButtonCls: 'btn btn-prev btn-primary btn-lg pull-right',
  backButtonText: 'Previous',
  backButtonCls: 'btn btn-next btn-primary btn-lg pull-left',
  hocValidationAppliedTo: []
};

StepZilla.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,
    component: PropTypes.element.isRequired
  })).isRequired,
  showSteps: PropTypes.bool,
  showNavigation: PropTypes.bool,
  stepsNavigation: PropTypes.bool,
  prevBtnOnLastStep: PropTypes.bool,
  dontValidate: PropTypes.bool,
  preventEnterSubmission: PropTypes.bool,
  startAtStep: PropTypes.number,
  nextButtonText: PropTypes.string,
  nextButtonCls: PropTypes.string,
  backButtonCls: PropTypes.string,
  backButtonText: PropTypes.string,
  hocValidationAppliedTo: PropTypes.array,
  onStepChange: PropTypes.func
};
