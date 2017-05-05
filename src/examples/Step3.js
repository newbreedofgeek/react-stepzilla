'use strict';

import React, { Component } from 'react';

export default class Step3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.getStore().email,
      gender: props.getStore().gender
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().email != userInput.email || this.props.getStore().gender != userInput.gender) { // only update store of something changed
          this.props.updateStore({
            ...userInput,
            savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        }

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
  }

  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

   _validateData(data) {
    return  {
      genderVal: (data.gender != 0), // required: anything besides N/A
      emailVal: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(data.email), // required: regex w3c uses in html5
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      genderValMsg: val.genderVal ? '' : 'A gender selection is required',
      emailValMsg: val.emailVal ? '' : 'A valid email is required'
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      gender: this.refs.gender.value,
      email: this.refs.email.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.genderVal == 'undefined' || this.state.genderVal) {
      notValidClasses.genderCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.genderCls = 'has-error col-md-8';
       notValidClasses.genderValGrpCls = 'val-err-tooltip';
    }

    if (typeof this.state.emailVal == 'undefined' || this.state.emailVal) {
        notValidClasses.emailCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.emailCls = 'has-error col-md-8';
       notValidClasses.emailValGrpCls = 'val-err-tooltip';
    }

    return (
      <div className="step step3">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>Step 3: Basic JavaScript Validation Example</h1>
              </label>
            </div>
            <div className="row content">
              <div className="col-md-12">
                This example component has a form that uses local standard basic JavaScript validation.
              </div>
            </div>
            <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                  Gender
                </label>
                <div className={notValidClasses.genderCls}>
                  <select
                    ref="gender"
                    autoComplete="off"
                    className="form-control"
                    required
                    defaultValue={this.state.gender}
                    onBlur={this.validationCheck}>
                      <option value="">Please select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                  </select>
                  <div className={notValidClasses.genderValGrpCls}>{this.state.genderValMsg}</div>
                </div>
              </div>
              <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                  Email
                </label>
                <div className={notValidClasses.emailCls}>
                  <input
                    ref="email"
                    autoComplete="off"
                    type="email"
                    placeholder="john.smith@example.com"
                    className="form-control"
                    required
                    defaultValue={this.state.email}
                    onBlur={this.validationCheck} />
                  <div className={notValidClasses.emailValGrpCls}>{this.state.emailValMsg}</div>
                </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
