import React, { Component, PropTypes } from 'react';

export default class StepZilla extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: this.props.startAtStep,
      navState: this.getNavStates(0, this.props.steps.length),
      nextStepText: 'Next'
    };

    this.hidden = {
      display: 'none'
    };
  }

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

  checkNavState(currentStep){
    if (currentStep > 0 && currentStep !== this.props.steps.length - 1) {
      let correctNextText = 'Next';

      if (currentStep == this.props.steps.length - 2) {
        // we are in the one before final step
        correctNextText = this.props.nextTextOnFinalActionStep
      }

      this.setState({
        showPreviousBtn: true,
        showNextBtn: true,
        nextStepText: correctNextText
      });
    }
    else if (currentStep === 0 ) {
      this.setState({
        showPreviousBtn: false,
        showNextBtn: true
      });
    }
    else {
      this.setState({
        showPreviousBtn: (this.props.prevBtnOnLastStep) ? true : false,
        showNextBtn: false
      });
    }
  }

  setNavState(next) {
    this.setState({navState: this.getNavStates(next, this.props.steps.length)});

    if (next < this.props.steps.length) {
      this.setState({compState: next});
    }

    this.checkNavState(next);
  }

  // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next
  handleKeyDown(evt) {
    if (evt.which === 13) {
      if (!this.props.preventEnterSubmission) {
        this.next();
      }
      else {
        evt.preventDefault();
      }
    }
  }

  // this utility method lets Child components invoke a direct jump to another step
  jumpToStep(evt) {
    if (evt.target == undefined) {
      // a child step wants to invoke a jump between steps
      this.setNavState(evt);
    }
    else {
      // the main navigation step ui is invoking a jump between steps
      if (!this.props.stepsNavigation) {
        evt.preventDefault();
        evt.stopPropagation();

        return;
      }

      if (this.props.dontValidate || typeof this.refs.activeComponent.isValidated == 'undefined' || this.refs.activeComponent.isValidated() ) {
          if (evt.target.value === (this.props.steps.length - 1) &&
            this.state.compState === (this.props.steps.length - 1)) {
              this.setNavState(this.props.steps.length);
          }
          else {
            this.setNavState(evt.target.value);
          }
      }
    }
  }

  next() {
    // if its a form component, it should have implemeted a public isValidated class. If not then continue
    if (this.props.dontValidate || typeof this.refs.activeComponent.isValidated == 'undefined' || this.refs.activeComponent.isValidated()) {
      this.setNavState(this.state.compState + 1);
    }
  }

  previous() {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  }

  getClassName(className, i){
    let liClassName = className + "-" + this.state.navState.styles[i];

    // if step ui based navigation is disabled, then dont highlight step
    if (!this.props.stepsNavigation)
        liClassName += " no-hl";

    return liClassName;
  }

  renderSteps() {
    return this.props.steps.map((s, i)=> (
      <li className={this.getClassName("progtrckr", i)} onClick={(evt) => {this.jumpToStep(evt)}} key={i} value={i}>
        <em>{i+1}</em>
        <span>{this.props.steps[i].name}</span>
      </li>
    ));
  }

  render() {
    // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
    const compToRender = React.cloneElement(this.props.steps[this.state.compState].component, {
        ref: 'activeComponent',
        jumpToStep: (t) => {
          this.jumpToStep(t);
        }
    });

    return (
      <div className="multi-step full-height" onKeyDown={(evt) => {this.handleKeyDown(evt)}}>
        {
          this.props.showSteps
          ? <ol className="progtrckr">
              {this.renderSteps()}
            </ol>
          : <span></span>
        }

        {compToRender}

        <div style={this.props.showNavigation ? {} : this.hidden} className="footer-buttons">

          <button style={this.state.showPreviousBtn ? {} : this.hidden}
                  className="btn btn-prev btn-primary btn-lg pull-left"
                  onClick={() => {this.previous()}}>Previous</button>

          <button style={this.state.showNextBtn ? {} : this.hidden}
                  className="btn btn-next btn-primary btn-lg pull-right"
                  onClick={() => {this.next()}}>{this.state.nextStepText}</button>
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
  nextTextOnFinalActionStep: "Next"
};
