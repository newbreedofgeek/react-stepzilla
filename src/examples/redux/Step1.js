'use strict';

import React, { Component } from 'react';

export default class Step1 extends Component {
  constructor(props) {
    super(props);
  }

  // not required as this component has no forms or user entry
  isValidated() {
    console.log('isValidated works as well...');
  }

  render() {
    return (
      <div className="step step1">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>Redux Example - We are in step {this.props.activeStep}</h1>
              </label>
              <div className="row">
                <div className="col-md-12">
                  <div className="intro">
                    This example implementation shows StepZilla working with Redux as the datastore. Soruce code is in 'examples/redux'.
                  </div>
                  <div className="btn btn-info" onClick={this.props.saySomething}> Say Hello via Redux Action </div>
                  { this.props.whatsUp !== '' && <div className="btn btn-warning" onClick={this.props.clearSaid}> Clear Hello </div> }
                  <h2>{ this.props.whatsUp }</h2>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
