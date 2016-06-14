'use strict';

import React, { Component, PropTypes } from 'react';

export default class Step2 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      gender: ''
    };

    this.validationCheck = this._validationCheck.bind(this);
    this.isValidated = this._isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  _isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        //store.update(); // Update store here

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
  }

  _validationCheck() {
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
      <div className="step2">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group col-md-12">
                <label className="control-label col-md-4">
                  <div className={notValidClasses.genderValGrpCls}>{this.state.genderValMsg}</div>
                  Gender
                </label>
                <div className={notValidClasses.genderCls}>
                  <select ref="gender" autocomplete="off" className="form-control" defaultValue={this.state.gender} required onBlur={this.validationCheck}>
                    <option value="">Please select</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group col-md-12">
                <label className="control-label col-md-4">
                  <div className={notValidClasses.emailValGrpCls}>{this.state.emailValMsg}</div>
                  Email
                </label>
                <div className={notValidClasses.emailCls}>
                  <input ref="email" autocomplete="off" type="email" placeholder="john.smith@example.com" className="form-control" defaultValue={this.state.email} required onBlur={this.validationCheck} />
                </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
