'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Joi from 'joi';

class Step4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailEmergency: props.getStore().emailEmergency
    };

    this.validatorTypes = {
      emailEmergency: Joi.string().email().required()
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.renderHelpText = this.renderHelpText.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  isValidated() {
    return new Promise((resolve, reject) => {
      this.props.validate((error) => {
        if (error) {
          reject(); // form contains errors
          return;
        }

        if (this.props.getStore().emailEmergency != this.getValidatorData().emailEmergency) { // only update store of something changed
          this.props.updateStore({
            ...this.getValidatorData(),
            savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        }

        resolve(); // form is valid, fire action
      });
    });
  }

  getValidatorData() {
    return {
      emailEmergency: this.refs.emailEmergency.value,
    }
  };

  onChange(e) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      this.setState(newState);
  }

  renderHelpText(message, id) {
      return (<div className="val-err-tooltip" key={id}><span>{message}</span></div>);
  };

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};
    notValidClasses.emailEmergencyCls = this.props.isValid('emailEmergency') ?
        'no-error col-md-8' : 'has-error col-md-8';

    return (
        <div className="step step4">
            <div className="row">
                <form id="Form" className="form-horizontal">
                  <div className="form-group">
                    <label className="control-label col-md-12 ">
                        <h1>{this.props.t("step4Head")}</h1>
                    </label>
                  </div>
                  <div className="form-group col-md-12 content form-block-holder">
                    <label className="control-label col-md-4">
                      {this.props.t("step4EmergencyMail")}
                    </label>
                    <div className={notValidClasses.emailEmergencyCls}>
                        <input
                            ref="emailEmergency"
                            name="emailEmergency"
                            autoComplete="off"
                            type="email"
                            className="form-control"
                            placeholder="john.smith@example.com"
                            required
                            defaultValue={this.state.emailEmergency}
                            onBlur={this.props.handleValidation('emailEmergency')}
                            onChange={this.onChange.bind(this)}
                        />

                        {this.props.getValidationMessages('emailEmergency').map(this.renderHelpText)}
                    </div>
                  </div>
                  <div className="form-group hoc-alert col-md-12 form-block-holder">
                    <label className="col-md-12 control-label">
                      <h4>{this.props.t("step4ShownExample")} <a href="https://github.com/jurassix/react-validation-mixin" target="_blank">react-validation-mixin</a> {this.props.t("step4HandleValidations")}</h4>
                    </label>
                    <br />
                    <div className="green">{this.props.t("step4StepZillaSteps")}</div>
                  </div>
                </form>
            </div>
        </div>
    )
  }
}

Step4.propTypes = {
  errors: PropTypes.object,
  validate: PropTypes.func,
  isValid: PropTypes.func,
  handleValidation: PropTypes.func,
  getValidationMessages: PropTypes.func,
  clearValidations: PropTypes.func,
  getStore: PropTypes.func,
  updateStore: PropTypes.func
};

export default validation(strategy)(Step4);
