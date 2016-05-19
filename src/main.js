import React, { Component, PropTypes } from 'react';

export default class StepZilla extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: 0,
      navState: this._getNavStates(0, this.props.steps.length)
    };

    this.hidden = {
      display: 'none'
    };

    this.jumpToStep = this._jumpToStep.bind(this);
    this.handleKeyDown = this._handleKeyDown.bind(this);
    this.next = this._next.bind(this);
    this.previous = this._previous.bind(this);
  }

  _getNavStates(indx, length) {
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

    return { current: indx, styles: styles }
  }

  _checkNavState(currentStep){
    if (currentStep > 0 && currentStep !== this.props.steps.length - 1) {
      this.setState({
        showPreviousBtn: true,
        showNextBtn: true
      });
    }
    else if (currentStep === 0) {
      this.setState({
        showPreviousBtn: false,
        showNextBtn: true
      });
    }
    else {
      this.setState({
        showPreviousBtn: true,
        showNextBtn: false
      });
    }
  }

  _setNavState(next) {
    this.setState({navState: this._getNavStates(next, this.props.steps.length)});

    if (next < this.props.steps.length) {
      this.setState({compState: next});
    }

    this._checkNavState(next);
  }

  _handleKeyDown(evt) {
    if (evt.which === 13) {
      this._next()
    }
  }

  _jumpToStep(evt) {
    if (evt.target == undefined) {
      // a child step wants to invoke a jump between steps
      this._setNavState(evt);
    }
    else {
      // the main navigation step ui is invoking a jump between steps
      if (typeof this.refs.activeComponent.isValidated == 'undefined' || this.refs.activeComponent.isValidated()) {
        if (evt.target.value === (this.props.steps.length - 1) &&
          this.state.compState === (this.props.steps.length - 1)) {
            this._setNavState(this.props.steps.length);
        }
        else {
          this._setNavState(evt.target.value);
        }
      }
    }
  }

  _next() {
    // if its a form component, it should have implemeted a public isValidated class. If not then continue
    if (typeof this.refs.activeComponent.isValidated == 'undefined' || this.refs.activeComponent.isValidated()) {
      this._setNavState(this.state.compState + 1);
    }
  }

  _previous() {
    if (this.state.compState > 0) {
      this._setNavState(this.state.compState - 1);
    }
  }

  _getClassName(className, i){
    return className + "-" + this.state.navState.styles[i];
  }

  _renderSteps() {
    return this.props.steps.map((s, i)=> (
      <li className={this._getClassName("progtrckr", i)} onClick={this.jumpToStep} key={i} value={i}>
        <em>{i+1}</em>
        <span>{this.props.steps[i].name}</span>
      </li>
    ));
  }

  render() {
    // clone the step component dynamically and tag it as activeComponent so we can validate it on next
    const compToRender = React.cloneElement(this.props.steps[this.state.compState].component, {
        ref: 'activeComponent',
        jumpToStep: (t) => {
          this.jumpToStep(t);
        }
    });

    return (
      <div className="multi-step full-height" onKeyDown={this.handleKeyDown}>

        <ol className="progtrckr">
          {this._renderSteps()}
        </ol>

        {compToRender}

        <div style={this.props.showNavigation ? {} : this.hidden} className="footer-buttons">

          <button style={this.state.showPreviousBtn ? {} : this.hidden}
                  className="btn btn-primary btn-lg pull-left"
                  onClick={this.previous}>Previous</button>

          <button style={this.state.showNextBtn ? {} : this.hidden}
                  className="btn btn-primary btn-lg pull-right"
                  onClick={this.next}>Next</button>
        </div>
      </div>
    );
  }
}

StepZilla.defaultProps = {
  showNavigation: true
};
