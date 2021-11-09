"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StepZilla;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _promise = _interopRequireDefault(require("promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function StepZilla(props) {
  var _useState = (0, _react.useState)(props.startAtStep),
      _useState2 = _slicedToArray(_useState, 2),
      compState = _useState2[0],
      setCompState = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      navState = _useState4[0],
      setNavState = _useState4[1];

  var hidden = {
    display: 'none'
  };
  (0, _react.useEffect)(function () {
    setNavState(getNavStates(props.startAtStep, props.steps.length));
  }, []); // update the header nav states via classes so they can be styled via css

  var getNavStates = function getNavStates(indx, length) {
    var styles = [];

    for (var i = 0; i < length; i++) {
      if (i < indx || !props.prevBtnOnLastStep && indx === length - 1) {
        styles.push('done');
      } else if (i === indx) {
        styles.push('doing');
      } else {
        styles.push('todo');
      }
    }

    return {
      styles: styles
    };
  };

  var getPrevNextBtnLayout = function getPrevNextBtnLayout(currentStep) {
    // first set default values
    var showPreviousBtn = true;
    var showNextBtn = true;
    var nextStepText = props.nextButtonText; // first step hide previous btn

    if (currentStep === 0) {
      showPreviousBtn = false;
    } // second to last step change next btn text if supplied as props


    if (currentStep === props.steps.length - 2) {
      // if user did not give a custom nextTextOnFinalActionStep, the nextButtonText becomes the default
      var nextTextOnFinalActionStep = props.nextTextOnFinalActionStep ? props.nextTextOnFinalActionStep : props.nextButtonText;
      nextStepText = nextTextOnFinalActionStep || nextStepText;
    } // last step hide next btn, hide previous btn if supplied as props


    if (currentStep >= props.steps.length - 1) {
      showNextBtn = false;
      showPreviousBtn = props.prevBtnOnLastStep === false ? false : true;
    }

    return {
      showPreviousBtn: showPreviousBtn,
      showNextBtn: showNextBtn,
      nextStepText: nextStepText
    };
  }; // which step are we in?


  var checkNavState = function checkNavState(nextStep) {
    if (props.onStepChange) {
      props.onStepChange(nextStep);
    }
  }; // set the nav state


  var adjustNavState = function adjustNavState(next) {
    setNavState(getNavStates(next, props.steps.length));

    if (next < props.steps.length) {
      setCompState(next);
    }

    checkNavState(next);
  }; // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next (ignore textareas as they should allow line breaks)


  var handleKeyDown = function handleKeyDown(evt) {
    if (evt.which === 13) {
      if (!props.preventEnterSubmission && evt.target.type !== 'textarea') {
        next();
      } else if (evt.target.type !== 'textarea') {
        evt.preventDefault();
      }
    }
  }; // this utility method lets Child components invoke a direct jump to another step


  var _jumpToStep = function jumpToStep(evt) {
    if (typeof evt.target === 'undefined') {
      // a child step wants to invoke a jump between steps. in this case 'evt' is the numeric step number and not the JS event
      adjustNavState(evt);
    } else {
      // the main navigation step ui is invoking a jump between steps
      // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore
      if (!props.stepsNavigation || evt.target.value === compState) {
        evt.preventDefault();
        evt.stopPropagation();
        return;
      } // evt is a react event so we need to persist it as we deal with aync promises which nullifies these events (https://facebook.github.io/react/docs/events.html#event-pooling)


      evt.persist();
      var movingBack = evt.target.value < compState; // are we trying to move back or front?

      var passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...

      var proceed = false; // flag on if we should move on

      abstractStepMoveAllowedToPromise(movingBack).then(function (valid) {
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
            passThroughStepsNotValid = props.steps.reduce(function (a, c, i) {
              if (i >= compState && i < evt.target.value) {
                a.push(c.validated);
              }

              return a;
            }, []).some(function (c) {
              return c === false;
            });
          }
        }
      }).catch(function () {
        // Promise based validation was a fail (i.e reject())
        if (!movingBack) {
          updateStepValidationFlag(false);
        }
      }).then(function () {
        // this is like finally(), executes if error no no error
        if (proceed && !passThroughStepsNotValid) {
          if (evt.target.value === props.steps.length - 1 && compState === props.steps.length - 1) {
            adjustNavState(props.steps.length);
          } else {
            adjustNavState(evt.target.value);
          }
        }
      }).catch(function (e) {
        if (e) {
          // see note below called "CatchRethrowing"
          // ... plus the finally then() above is what throws the JS Error so we need to catch that here specifically
          setTimeout(function () {
            throw e;
          });
        }
      });
    }
  }; // move next via next button


  var next = function next() {
    abstractStepMoveAllowedToPromise().then(function () {
      var proceed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined,
      // ... so make it true. Or else 'proceed' will carry the true/false value from sync validation
      updateStepValidationFlag(proceed);

      if (proceed) {
        adjustNavState(compState + 1);
      }
    }).catch(function (e) {
      if (e) {
        // CatchRethrowing: as we wrap StepMoveAllowed() to resolve as a Promise, the then() is invoked and the next React Component is loaded.
        // ... during the render, if there are JS errors thrown (e.g. ReferenceError) it gets swallowed by the Promise library and comes in here (catch)
        // ... so we need to rethrow it outside the execution stack so it behaves like a notmal JS error (i.e. halts and prints to console)
        //
        setTimeout(function () {
          throw e;
        });
      } // Promise based validation was a fail (i.e reject())


      updateStepValidationFlag(false);
    });
  }; // move behind via previous button


  var previous = function previous() {
    if (compState > 0) {
      adjustNavState(compState - 1);
    }
  }; // update step's validation flag


  var updateStepValidationFlag = function updateStepValidationFlag() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    props.steps[compState].validated = val; // note: if a step component returns 'underfined' then treat as "true".
  };

  var activeComponentRef = (0, _react.useRef)(null); // are we allowed to move forward? via the next button or via jumpToStep?

  var stepMoveAllowed = function stepMoveAllowed() {
    var skipValidationExecution = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var proceed = false;

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

  var isStepAtIndexHOCValidationBased = function isStepAtIndexHOCValidationBased(stepIndex) {
    return props.hocValidationAppliedTo && props.hocValidationAppliedTo.length > 0 && props.hocValidationAppliedTo.indexOf(stepIndex) > -1;
  }; // a validation method is each step can be sync or async (Promise based), this utility abstracts the wrapper stepMoveAllowed to be Promise driven regardless of validation return type


  var abstractStepMoveAllowedToPromise = function abstractStepMoveAllowedToPromise(movingBack) {
    return _promise.default.resolve(stepMoveAllowed(movingBack));
  }; // get the classmame of steps


  var getClassName = function getClassName(className, i) {
    var liClassName = '';

    if (navState && navState.styles) {
      liClassName = "".concat(className, "-").concat(navState.styles[i]); // if step ui based navigation is disabled, then dont highlight step

      if (!props.stepsNavigation) {
        liClassName += ' no-hl';
      }
    }

    return liClassName;
  }; // render the steps as stepsNavigation


  var renderSteps = function renderSteps() {
    var pointerEventsNone = {
      pointerEvents: 'none'
    };
    return props.steps.map(function (s, i) {
      return _react.default.createElement("li", {
        className: getClassName('progtrckr', i),
        onClick: function onClick(evt) {
          _jumpToStep(evt);
        },
        key: i,
        value: i
      }, _react.default.createElement("em", {
        style: pointerEventsNone
      }, i + 1), _react.default.createElement("span", {
        style: pointerEventsNone
      }, props.steps[i].name));
    });
  };

  var _getPrevNextBtnLayout = getPrevNextBtnLayout(compState),
      nextStepText = _getPrevNextBtnLayout.nextStepText,
      showNextBtn = _getPrevNextBtnLayout.showNextBtn,
      showPreviousBtn = _getPrevNextBtnLayout.showPreviousBtn; // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method


  var cloneExtensions = {
    jumpToStep: function jumpToStep(t) {
      _jumpToStep(t);
    }
  };
  var componentPointer = null;
  var compToRender = null;

  if (props.steps[compState]) {
    componentPointer = props.steps[compState].component; // S: ref binding -----
    // we need to bind a ref to it so we can use the imperitive "isValidated" method when needed to prevent navigation
    // ... we only can do this if its a (1) React Class based component or (2) A Hooks based stateful component wrapped in forwardRef
    // (1) can only update refs if its a regular React component (not a pure component - i.e. function components with no state), so lets check that

    if (componentPointer instanceof _react.Component || componentPointer.type && componentPointer.type.prototype instanceof _react.Component) {
      // unit test deteceted that instanceof Component can be in either of these locations so test both (not sure why this is the case)
      cloneExtensions.ref = activeComponentRef;
    } else {
      // (2) after react hooks was released, functional components can have state and therefore support refs
      // ... we do this via forwardRefs. So we need to support this as well
      // ... after testing, if both the below types are objects then it's a hooks function component wrapped in forwardRef
      if (_typeof(componentPointer) === 'object' && _typeof(componentPointer.type) === 'object') {
        cloneExtensions.ref = activeComponentRef;
      }
    } // E: ref binding -----


    compToRender = _react.default.cloneElement(componentPointer, cloneExtensions);
  } // main render of stepzilla container


  return _react.default.createElement("div", {
    className: "multi-step",
    onKeyDown: function onKeyDown(evt) {
      handleKeyDown(evt);
    }
  }, props.showSteps ? _react.default.createElement("ol", {
    className: "progtrckr"
  }, renderSteps()) : _react.default.createElement("span", null), compToRender, _react.default.createElement("div", {
    style: props.showNavigation ? {} : hidden,
    className: "footer-buttons"
  }, _react.default.createElement("button", {
    type: "button",
    style: showPreviousBtn ? {} : hidden,
    className: props.backButtonCls,
    onClick: function onClick() {
      previous();
    },
    id: "prev-button"
  }, props.backButtonText), _react.default.createElement("button", {
    type: "button",
    style: showNextBtn ? {} : hidden,
    className: props.nextButtonCls,
    onClick: function onClick() {
      next();
    },
    id: "next-button"
  }, nextStepText)));
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
  steps: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
    component: _propTypes.default.element.isRequired
  })).isRequired,
  showSteps: _propTypes.default.bool,
  showNavigation: _propTypes.default.bool,
  stepsNavigation: _propTypes.default.bool,
  prevBtnOnLastStep: _propTypes.default.bool,
  dontValidate: _propTypes.default.bool,
  preventEnterSubmission: _propTypes.default.bool,
  startAtStep: _propTypes.default.number,
  nextButtonText: _propTypes.default.string,
  nextButtonCls: _propTypes.default.string,
  backButtonCls: _propTypes.default.string,
  backButtonText: _propTypes.default.string,
  hocValidationAppliedTo: _propTypes.default.array,
  onStepChange: _propTypes.default.func
};