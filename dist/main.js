'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StepZilla = function (_Component) {
  _inherits(StepZilla, _Component);

  function StepZilla(props) {
    _classCallCheck(this, StepZilla);

    var _this = _possibleConstructorReturn(this, (StepZilla.__proto__ || Object.getPrototypeOf(StepZilla)).call(this, props));

    _this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: _this.props.startAtStep,
      navState: _this.getNavStates(0, _this.props.steps.length),
      nextStepText: 'Next'
    };

    _this.hidden = {
      display: 'none'
    };

    _this.applyValidationFlagsToSteps();
    return _this;
  }

  // extend the "steps" array with flags to indicate if they have been validated


  _createClass(StepZilla, [{
    key: 'applyValidationFlagsToSteps',
    value: function applyValidationFlagsToSteps() {
      var _this2 = this;

      this.props.steps.map(function (i) {
        if (_this2.props.dontValidate) {
          i.validated = true;
        } else {
          i.validated = typeof i.component.type.prototype._isValidated == 'undefined' ? true : false;
        }

        return i;
      });
    }

    // update the header nav states via classes so they can be styled via css

  }, {
    key: 'getNavStates',
    value: function getNavStates(indx, length) {
      var styles = [];

      for (var i = 0; i < length; i++) {
        if (i < indx) {
          styles.push('done');
        } else if (i === indx) {
          styles.push('doing');
        } else {
          styles.push('todo');
        }
      }

      return { current: indx, styles: styles };
    }

    // which step are we in?

  }, {
    key: 'checkNavState',
    value: function checkNavState(currentStep) {
      if (currentStep > 0 && currentStep !== this.props.steps.length - 1) {
        var correctNextText = 'Next';

        if (currentStep == this.props.steps.length - 2) {
          correctNextText = this.props.nextTextOnFinalActionStep; // we are in the one before final step
        }

        this.setState({
          showPreviousBtn: true,
          showNextBtn: true,
          nextStepText: correctNextText
        });
      } else if (currentStep === 0) {
        this.setState({
          showPreviousBtn: false,
          showNextBtn: true
        });
      } else {
        this.setState({
          showPreviousBtn: this.props.prevBtnOnLastStep ? true : false,
          showNextBtn: false
        });
      }
    }

    // set the nav state

  }, {
    key: 'setNavState',
    value: function setNavState(next) {
      this.setState({ navState: this.getNavStates(next, this.props.steps.length) });

      if (next < this.props.steps.length) {
        this.setState({ compState: next });
      }

      this.checkNavState(next);
    }

    // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next

  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(evt) {
      if (evt.which === 13) {
        if (!this.props.preventEnterSubmission) {
          this.next();
        } else {
          evt.preventDefault();
        }
      }
    }

    // this utility method lets Child components invoke a direct jump to another step

  }, {
    key: 'jumpToStep',
    value: function jumpToStep(evt) {
      var _this3 = this;

      if (evt.target == undefined) {
        // a child step wants to invoke a jump between steps
        this.setNavState(evt);
      } else {
        // the main navigation step ui is invoking a jump between steps
        if (!this.props.stepsNavigation || evt.target.value == this.state.compState) {
          // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore
          evt.preventDefault();
          evt.stopPropagation();

          return;
        }

        // are we trying to move back or front?
        var movingBack = evt.target.value < this.state.compState;

        if (this.stepMoveAllowed(movingBack)) {
          var passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...

          if (!movingBack) {
            // looks like we are moving forward, 'reduce' a new array of step>validated values we need to check and 'some' that to get a decision on if we should allow moving forward
            passThroughStepsNotValid = this.props.steps.reduce(function (a, c, i) {
              if (i >= _this3.state.compState && i < evt.target.value) {
                a.push(c.validated);
              }
              return a;
            }, []).some(function (c) {
              return c === false;
            });
          }

          if (!passThroughStepsNotValid) {
            if (evt.target.value === this.props.steps.length - 1 && this.state.compState === this.props.steps.length - 1) {
              this.setNavState(this.props.steps.length);
            } else {
              this.setNavState(evt.target.value);
            }
          }
        }
      }
    }

    // move next via next button

  }, {
    key: 'next',
    value: function next() {
      if (this.stepMoveAllowed()) {
        this.setNavState(this.state.compState + 1);
      }
    }

    // move behind via previous button

  }, {
    key: 'previous',
    value: function previous() {
      if (this.state.compState > 0) {
        this.setNavState(this.state.compState - 1);
      }
    }

    // are we allowed to move forward? via the next button or via jumpToStep?

  }, {
    key: 'stepMoveAllowed',
    value: function stepMoveAllowed() {
      var skipValidationExecution = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var proceed = false;

      if (this.props.dontValidate) {
        proceed = true;
      } else {
        // if its a form component, it should have implemeted a public isValidated class. If not then continue
        if (typeof this.refs.activeComponent.isValidated == 'undefined') {
          proceed = true;
        } else if (skipValidationExecution) {
          // we are moving backwards in steps, in this case dont validate as it means the user is not commiting to "save"
          proceed = true;
        } else {
          // user is moving forward in steps, invoke validation as its available
          proceed = this.refs.activeComponent.isValidated();
          this.props.steps[this.state.compState].validated = typeof proceed == 'undefined' ? true : proceed; // if a step component returns 'underfined' then trate as "true" as it's an aync call (i.e. ajax call)
        }
      }

      return proceed;
    }

    // get the classmame of steps

  }, {
    key: 'getClassName',
    value: function getClassName(className, i) {
      var liClassName = className + "-" + this.state.navState.styles[i];

      // if step ui based navigation is disabled, then dont highlight step
      if (!this.props.stepsNavigation) liClassName += " no-hl";

      return liClassName;
    }

    // render the steps as stepsNavigation

  }, {
    key: 'renderSteps',
    value: function renderSteps() {
      var _this4 = this;

      return this.props.steps.map(function (s, i) {
        return _react2.default.createElement(
          'li',
          { className: _this4.getClassName("progtrckr", i), onClick: function onClick(evt) {
              _this4.jumpToStep(evt);
            }, key: i, value: i },
          _react2.default.createElement(
            'em',
            null,
            i + 1
          ),
          _react2.default.createElement(
            'span',
            null,
            _this4.props.steps[i].name
          )
        );
      });
    }

    // main render of stepzilla container

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
      var compToRender = _react2.default.cloneElement(this.props.steps[this.state.compState].component, {
        ref: 'activeComponent',
        jumpToStep: function jumpToStep(t) {
          _this5.jumpToStep(t);
        }
      });

      return _react2.default.createElement(
        'div',
        { className: 'multi-step full-height', onKeyDown: function onKeyDown(evt) {
            _this5.handleKeyDown(evt);
          } },
        this.props.showSteps ? _react2.default.createElement(
          'ol',
          { className: 'progtrckr' },
          this.renderSteps()
        ) : _react2.default.createElement('span', null),
        compToRender,
        _react2.default.createElement(
          'div',
          { style: this.props.showNavigation ? {} : this.hidden, className: 'footer-buttons' },
          _react2.default.createElement(
            'button',
            { style: this.state.showPreviousBtn ? {} : this.hidden,
              className: 'btn btn-prev btn-primary btn-lg pull-left',
              onClick: function onClick() {
                _this5.previous();
              } },
            'Previous'
          ),
          _react2.default.createElement(
            'button',
            { style: this.state.showNextBtn ? {} : this.hidden,
              className: 'btn btn-next btn-primary btn-lg pull-right',
              onClick: function onClick() {
                _this5.next();
              } },
            this.state.nextStepText
          )
        )
      );
    }
  }]);

  return StepZilla;
}(_react.Component);

exports.default = StepZilla;


StepZilla.defaultProps = {
  showSteps: true,
  showNavigation: true,
  stepsNavigation: true,
  prevBtnOnLastStep: true,
  dontValidate: false,
  preventEnterSubmission: false,
  startAtStep: 0,
  nextTextOnFinalActionStep: "Next"
};