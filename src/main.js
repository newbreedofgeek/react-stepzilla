import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Promise from 'promise';

export default class StepZilla extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.getPrevNextBtnState(this.props.startAtStep),
      compState: this.props.startAtStep,
      navState: this.getNavStates(this.props.startAtStep, this.props.steps.length),
    };

    this.hidden = {
      display: 'none'
    };

    // if user did not give a custom nextTextOnFinalActionStep, the nextButtonText becomes the default
    this.nextTextOnFinalActionStep = (this.props.nextTextOnFinalActionStep) ? this.props.nextTextOnFinalActionStep : this.props.nextButtonText;

    this.applyValidationFlagsToSteps();
  }

  // extend the "steps" array with flags to indicate if they have been validated
  applyValidationFlagsToSteps() {
    this.props.steps.map((i, idx) => {
      if (this.props.dontValidate) {
        i.validated = true;
      }
      else {
        // check if isValidated was exposed in the step, if yes then set initial state as not validated (false) or vice versa
        // if HOCValidation is used for the step then mark it as "requires to be validated. i.e. false"
        i.validated = (typeof i.component.type === 'undefined' ||
          (typeof i.component.type.prototype.isValidated === 'undefined' &&
            !this.isStepAtIndexHOCValidationBased(idx))) ? true : false;
      }

      return i;
    });
  }

  // update the header nav states via classes so they can be styled via css
  getNavStates(indx, length) {
    let styles = [];

    for (let i=0; i<length; i++) {
      if (i < indx) {
        styles.push('done');
      }
      else if (i === indx) {
        styles.push('doing');
      }
      else {
        styles.push('todo');
      }
    }

    return { current: indx, styles }
  }

  getPrevNextBtnState(currentStep) {
    // first set default values
    let showPreviousBtn = true;
    let showNextBtn = true;
    let nextStepText = this.props.nextButtonText;

    // first step hide previous btn
    if (currentStep === 0) {
      showPreviousBtn = false;
    }

    // second to last step change next btn text if supplied as props
    if (currentStep === this.props.steps.length - 2 ) {
      nextStepText = this.props.nextTextOnFinalActionStep || nextStepText;
    }

    // last step hide next btn, hide previous btn if supplied as props
    if (currentStep >= this.props.steps.length - 1) {
      showNextBtn = false;
      showPreviousBtn = this.props.prevBtnOnLastStep === false ? false : true;
    }

    return {
      showPreviousBtn,
      showNextBtn,
      nextStepText
    };
  }

  // which step are we in?
  checkNavState(nextStep) {
    if (this.props.onStepChange) {
      this.props.onStepChange(nextStep);
    }

    this.setState(this.getPrevNextBtnState(nextStep));
  }

  // set the nav state
  setNavState(next) {
    this.setState({navState: this.getNavStates(next, this.props.steps.length)});

    if (next < this.props.steps.length) {
      this.setState({compState: next});
    }

    this.checkNavState(next);
  }

  // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next (ignore textareas as they should allow line breaks)
  handleKeyDown(evt) {
    if (evt.which === 13) {
      if (!this.props.preventEnterSubmission && evt.target.type !== 'textarea') {
        this.next();
      }
      else if (evt.target.type !== 'textarea') {
        evt.preventDefault();
      }
    }
  }

  // this utility method lets Child components invoke a direct jump to another step
  jumpToStep(evt) {
    if (evt.target == undefined) {
      // a child step wants to invoke a jump between steps. in this case 'evt' is the numeric step number and not the JS event
      this.setNavState(evt);
    }
    else { // the main navigation step ui is invoking a jump between steps
      if (!this.props.stepsNavigation || evt.target.value === this.state.compState) { // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore
        evt.preventDefault();
        evt.stopPropagation();

        return;
      }

      evt.persist(); // evt is a react event so we need to persist it as we deal with aync promises which nullifies these events (https://facebook.github.io/react/docs/events.html#event-pooling)

      const movingBack = evt.target.value < this.state.compState; // are we trying to move back or front?
      let passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...
      let proceed = false; // flag on if we should move on

      this.abstractStepMoveAllowedToPromise(movingBack)
        .then((valid = true) => { // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined, so make it true. Or else 'proceed' will carry the true/false value from sync v
          proceed = valid;

          if (!movingBack) {
            this.updateStepValidationFlag(proceed);
          }

          if (proceed) {
            if (!movingBack) {
              // looks like we are moving forward, 'reduce' a new array of step>validated values we need to check and 'some' that to get a decision on if we should allow moving forward
              passThroughStepsNotValid = this.props.steps
                .reduce((a, c, i) => {
                  if (i >= this.state.compState && i < evt.target.value) {
                    a.push(c.validated);
                  }
                  return a;
                }, [])
                .some((c) => {
                  return c === false
                })
            }
          }
        })
        .catch((e) => {
          // Promise based validation was a fail (i.e reject())
          if (!movingBack) {
            this.updateStepValidationFlag(false);
          }
        })
        .then(() => {
          // this is like finally(), executes if error no no error
          if (proceed && !passThroughStepsNotValid) {
            if (evt.target.value === (this.props.steps.length - 1) &&
              this.state.compState === (this.props.steps.length - 1)) {
                this.setNavState(this.props.steps.length);
            }
            else {
              this.setNavState(evt.target.value);
            }
          }
        })
        .catch(e => {
          if (e) {
            // see note below called "CatchRethrowing"
            // ... plus the finally then() above is what throws the JS Error so we need to catch that here specifically
            setTimeout(function() { throw e; });
          }
        });
    }
  }

  // move next via next button
  next() {
    this.abstractStepMoveAllowedToPromise()
      .then((proceed = true) => {
        // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined, so make it true. Or else 'proceed' will carry the true/false value from sync validation
        this.updateStepValidationFlag(proceed);

        if (proceed) {
          this.setNavState(this.state.compState + 1);
        }
      })
      .catch((e) => {
        if (e) {
          // CatchRethrowing: as we wrap StepMoveAllowed() to resolve as a Promise, the then() is invoked and the next React Component is loaded.
          // ... during the render, if there are JS errors thrown (e.g. ReferenceError) it gets swallowed by the Promise library and comes in here (catch)
          // ... so we need to rethrow it outside the execution stack so it behaves like a notmal JS error (i.e. halts and prints to console)
          //
          setTimeout(function() { throw e; });
        }

        // Promise based validation was a fail (i.e reject())
        this.updateStepValidationFlag(false);
      });
  }

  // move behind via previous button
  previous() {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  }

  // update step's validation flag
  updateStepValidationFlag(val = true) {
    this.props.steps[this.state.compState].validated = val; // note: if a step component returns 'underfined' then treat as "true".
  }

  // are we allowed to move forward? via the next button or via jumpToStep?
  stepMoveAllowed(skipValidationExecution = false) {
    let proceed = false;

    if (this.props.dontValidate) {
      proceed = true;
    }
    else {
      if (skipValidationExecution) {
        // we are moving backwards in steps, in this case dont validate as it means the user is not commiting to "save"
        proceed = true;
      }
      else if (this.isStepAtIndexHOCValidationBased(this.state.compState)) {
        // the user is using a higer order component (HOC) for validation (e.g react-validation-mixin), this wraps the StepZilla steps as a HOC,
        // so use hocValidationAppliedTo to determine if this step needs the aync validation as per react-validation-mixin interface
        proceed = this.refs.activeComponent.refs.component.isValidated();
      }
      else if (Object.keys(this.refs).length == 0 || typeof this.refs.activeComponent.isValidated == 'undefined') {
        // if its a form component, it should have implemeted a public isValidated class (also pure componenets wont even have refs - i.e. a empty object). If not then continue
        proceed = true;
      }
      else {
        // user is moving forward in steps, invoke validation as its available
        proceed = this.refs.activeComponent.isValidated();
      }
    }

    return proceed;
  }

  isStepAtIndexHOCValidationBased(stepIndex) {
    return (this.props.hocValidationAppliedTo.length > 0 && this.props.hocValidationAppliedTo.indexOf(stepIndex) > -1);
  }

  // a validation method is each step can be sync or async (Promise based), this utility abstracts the wrapper stepMoveAllowed to be Promise driven regardless of validation return type
  abstractStepMoveAllowedToPromise(movingBack) {
    return Promise.resolve(this.stepMoveAllowed(movingBack));
  }

  // get the classmame of steps
  getClassName(className, i){
    let liClassName = className + "-" + this.state.navState.styles[i];

    // if step ui based navigation is disabled, then dont highlight step
    if (!this.props.stepsNavigation)
        liClassName += " no-hl";

    return liClassName;
  }

  // render the steps as stepsNavigation
  renderSteps() {
    return this.props.steps.map((s, i)=> (
      <li className={this.getClassName("progtrckr", i)} onClick={(evt) => {this.jumpToStep(evt)}} key={i} value={i}>
          <em>{i+1}</em>
          <span>{this.props.steps[i].name}</span>
      </li>
    ));
  }

  // main render of stepzilla container
  render() {
    const { props } = this;
    let compToRender;

    // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
    let cloneExtensions = {
      jumpToStep: (t) => {
        this.jumpToStep(t);
      }
    };

    const componentPointer = this.props.steps[this.state.compState].component;

    // can only update refs if its a regular React component (not a pure component), so lets check that
    if (componentPointer instanceof Component || // unit test deteceted that instanceof Component can be in either of these locations so test both (not sure why this is the case)
        (componentPointer.type && componentPointer.type.prototype instanceof Component)) {
          cloneExtensions.ref = 'activeComponent';
    }

    compToRender = React.cloneElement(componentPointer, cloneExtensions);

    return (
      <div className="multi-step" onKeyDown={(evt) => {this.handleKeyDown(evt)}}>
          {
              this.props.showSteps
                  ? <ol className="progtrckr">
                      {this.renderSteps()}
                  </ol>
              : <span></span>
          }

          {compToRender}
        <div style={this.props.showNavigation ? {} : this.hidden} className="footer-buttons">
          <button
            style={this.state.showPreviousBtn ? {} : this.hidden}
            className={props.backButtonCls}
            onClick={() => {this.previous()}}
            id="prev-button"
          >
            {this.props.backButtonText}
          </button>
          <button
            style={this.state.showNextBtn ? {} : this.hidden}
            className={props.nextButtonCls}
            onClick={() => {this.next()}}
            id="next-button"
          >
            {this.state.nextStepText}
          </button>
        </div>
      </div>
    );
  }
}

StepZilla.defaultProps = {
  showSteps: true,
  showNavigation: true,
  stepsNavigation: true,
  prevBtnOnLastStep: true,
  dontValidate: false,
  preventEnterSubmission: false,
  startAtStep: 0,
  nextButtonText: "Next",
  nextButtonCls: "btn btn-prev btn-primary btn-lg pull-right",
  backButtonText: "Previous",
  backButtonCls: "btn btn-next btn-primary btn-lg pull-left",
  hocValidationAppliedTo: []
};

StepZilla.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
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
}
