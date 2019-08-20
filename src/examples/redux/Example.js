'use strict';

import React, { Component } from 'react';
import StepZilla from '../../main';
import { connect } from 'react-redux';
import { sayHello, clearHello, updateActiveStep } from './actions';
import Step1 from './Step1';
import Step2 from './Step2';
import './main.css';

const mapStateToProps = (state) => ({
  whatsUp: state.say,
  activeStep: state.activeStep
});

const mapDispatchToProps = (dispatch) => ({
  saySomething: () => { dispatch(sayHello())},
  clearSaid: () => { dispatch(clearHello())},
  updateActiveStep: (activeStep) => { dispatch(updateActiveStep(activeStep))}
});

class Example extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const steps =
    [
      {name: 'Step1', component: <Step1 {...this.props} />},
      {name: 'Step2', component: <Step2 {...this.props} />},
    ]

    const { updateActiveStep } = this.props;

    return (
      <div className='example'>
        <div className='step-progress'>
          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            nextTextOnFinalActionStep={"Next"}
            onStepChange={(step) => (updateActiveStep(step))}
           />
        </div>
      </div>
    )
  }
}

Example = connect(
  mapStateToProps,
  mapDispatchToProps
)(Example);

export default Example;
