'use strict';

import React, { Component, PropTypes } from 'react';

export default class Step1 extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // _isValidated() {}


  render() {
    return (
      <div className="step3">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
                <label className="md-col-12 control-label">
                  <h1> Thanks!</h1>
                </label>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
