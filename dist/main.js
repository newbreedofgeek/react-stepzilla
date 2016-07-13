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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StepZilla).call(this, props));

    _this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: _this.props.startAtStep,
      navState: _this._getNavStates(0, _this.props.steps.length),
      nextStepText: 'Next'
    };

    _this.hidden = {
      display: 'none'
    };

    _this.jumpToStep = _this._jumpToStep.bind(_this);
    _this.handleKeyDown = _this._handleKeyDown.bind(_this);
    _this.next = _this._next.bind(_this);
    _this.previous = _this._previous.bind(_this);
    return _this;
  }

  _createClass(StepZilla, [{
    key: '_getNavStates',
    value: function _getNavStates(indx, length) {
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
  }, {
    key: '_checkNavState',
    value: function _checkNavState(currentStep) {
      if (currentStep > 0 && currentStep !== this.props.steps.length - 1) {
        var correctNextText = 'Next';

        if (currentStep == this.props.steps.length - 2) {
          // we are in the one before final step
          correctNextText = this.props.nextTextOnFinalActionStep;
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
  }, {
    key: '_setNavState',
    value: function _setNavState(next) {
      this.setState({ navState: this._getNavStates(next, this.props.steps.length) });

      if (next < this.props.steps.length) {
        this.setState({ compState: next });
      }

      this._checkNavState(next);
    }

    // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next

  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(evt) {
      if (evt.which === 13) {
        if (!this.props.preventEnterSubmission) {
          this._next();
        }
      }
    }

    // this utility method lets Child components invoke a direct jump to another step

  }, {
    key: '_jumpToStep',
    value: function _jumpToStep(evt) {
      if (evt.target == undefined) {
        // a child step wants to invoke a jump between steps
        this._setNavState(evt);
      } else {
        // the main navigation step ui is invoking a jump between steps
        if (!this.props.stepsNavigation) {
          evt.preventDefault();
          evt.stopPropagation();

          return;
        }

        if (this.props.dontValidate || typeof this.refs.activeComponent.isValidated == 'undefined' || this.refs.activeComponent.isValidated()) {
          if (evt.target.value === this.props.steps.length - 1 && this.state.compState === this.props.steps.length - 1) {
            this._setNavState(this.props.steps.length);
          } else {
            this._setNavState(evt.target.value);
          }
        }
      }
    }
  }, {
    key: '_next',
    value: function _next() {
      // if its a form component, it should have implemeted a public isValidated class. If not then continue
      if (this.props.dontValidate || typeof this.refs.activeComponent.isValidated == 'undefined' || this.refs.activeComponent.isValidated()) {
        this._setNavState(this.state.compState + 1);
      }
    }
  }, {
    key: '_previous',
    value: function _previous() {
      if (this.state.compState > 0) {
        this._setNavState(this.state.compState - 1);
      }
    }
  }, {
    key: '_getClassName',
    value: function _getClassName(className, i) {
      var liClassName = className + "-" + this.state.navState.styles[i];

      // if step ui based navigation is disabled, then dont highlight step
      if (!this.props.stepsNavigation) liClassName += " no-hl";

      return liClassName;
    }
  }, {
    key: '_renderSteps',
    value: function _renderSteps() {
      var _this2 = this;

      return this.props.steps.map(function (s, i) {
        return _react2.default.createElement(
          'li',
          { className: _this2._getClassName("progtrckr", i), onClick: _this2.jumpToStep, key: i, value: i },
          _react2.default.createElement(
            'em',
            null,
            i + 1
          ),
          _react2.default.createElement(
            'span',
            null,
            _this2.props.steps[i].name
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
      var compToRender = _react2.default.cloneElement(this.props.steps[this.state.compState].component, {
        ref: 'activeComponent',
        jumpToStep: function jumpToStep(t) {
          _this3.jumpToStep(t);
        }
      });

      return _react2.default.createElement(
        'div',
        { className: 'multi-step full-height', onKeyDown: this.handleKeyDown },
        this.props.showSteps ? _react2.default.createElement(
          'ol',
          { className: 'progtrckr' },
          this._renderSteps()
        ) : _react2.default.createElement('span', null),
        compToRender,
        _react2.default.createElement(
          'div',
          { style: this.props.showNavigation ? {} : this.hidden, className: 'footer-buttons' },
          _react2.default.createElement(
            'button',
            { style: this.state.showPreviousBtn ? {} : this.hidden,
              className: 'btn btn-primary btn-lg pull-left',
              onClick: this.previous },
            'Previous'
          ),
          _react2.default.createElement(
            'button',
            { style: this.state.showNextBtn ? {} : this.hidden,
              className: 'btn btn-primary btn-lg pull-right',
              onClick: this.next },
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