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

    this.applyValidationFlagsToSteps();
  }

  // extend the "steps" array with flags to indicate if they have been validated
  applyValidationFlagsToSteps() {
    this.props.steps.map((i) => {
      if (this.props.dontValidate) {
        i.validated = true;
      }
      else {
        i.validated = (typeof i.component.type.prototype._isValidated == 'undefined') ? true : false;
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

  // which step are we in?
  checkNavState(currentStep){
    if (currentStep > 0 && currentStep !== this.props.steps.length - 1) {
      let correctNextText = 'Next';

      if (currentStep == this.props.steps.length - 2) {
        correctNextText = this.props.nextTextOnFinalActionStep; // we are in the one before final step
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

  // set the nav state
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
    else { // the main navigation step ui is invoking a jump between steps
      if (!this.props.stepsNavigation || evt.target.value == this.state.compState) { // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore
        evt.preventDefault();
        evt.stopPropagation();

        return;
      }

      // are we trying to move back or front?
      const movingBack = evt.target.value < this.state.compState;

      if (this.stepMoveAllowed(movingBack)) {
        let passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...

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

        if (!passThroughStepsNotValid) {
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
  }

  // move next via next button
  next() {
    if (this.stepMoveAllowed()) {
      this.setNavState(this.state.compState + 1);
    }
  }

  // move behind via previous button
  previous() {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  }

  // are we allowed to move forward? via the next button or via jumpToStep?
  stepMoveAllowed(skipValidationExecution = false) {
    let proceed = false;

    if (this.props.dontValidate) {
      proceed = true;
    }
    else {
      // if its a form component, it should have implemeted a public isValidated class. If not then continue
      if (typeof this.refs.activeComponent.isValidated == 'undefined') {
        proceed = true;
      }
      else if (skipValidationExecution) {
        // we are moving backwards in steps, in this case dont validate as it means the user is not commiting to "save"
        proceed = true;
      }
      else {
        // user is moving forward in steps, invoke validation as its available
        proceed = this.refs.activeComponent.isValidated();
        this.props.steps[this.state.compState].validated = (typeof proceed == 'undefined') ? true : proceed; // if a step component returns 'underfined' then trate as "true" as it's an aync call (i.e. ajax call)
      }
    }

    return proceed;
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
