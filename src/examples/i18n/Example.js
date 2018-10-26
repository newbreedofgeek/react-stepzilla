'use strict';

import React, { Component } from 'react';
import StepZilla from '../../main';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import { withNamespaces } from 'react-i18next';

import './main.css';

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.sampleStore = {
      email: '',
      gender: '',
      savedToCloud: false
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getStore() {
    return this.sampleStore;
  }

  updateStore(update) {
    this.sampleStore = {
      ...this.sampleStore,
      ...update,
    }
  }

  render() {

    const { t, i18n } = this.props;

    const steps =
    [
      {name: t("step1"), component: <Step1 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step2"), component: <Step2 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step3"), component: <Step3 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step4"), component: <Step4 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step5"), component: <Step5 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step6"), component: <Step6 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />}
    ]

    return (
      <div className='example'>
        <div className='step-progress'>
          <div className='languageButtons'>
            <button onClick={() =>  i18n.changeLanguage("en")}>🇬🇧</button>
            <button onClick={() =>  i18n.changeLanguage("de")}>🇩🇪</button>
          </div>
          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            nextTextOnFinalActionStep={t("nextTextOnFinalActionStep")}
            hocValidationAppliedTo={[3]}
            nextButtonText={t("nextButtonText")}
            backButtonText={t("backButtonText")}
            startAtStep={window.sessionStorage.getItem('step') ? parseFloat(window.sessionStorage.getItem('step')) : 0}
            onStepChange={(step) => window.sessionStorage.setItem('step', step)}
           />
        </div>
      </div>
    )
  }
}

export default withNamespaces("translations")(Example);
