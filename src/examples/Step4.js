'use strict';

import React, { Component, PropTypes } from 'react';

export default class Step4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedToCloud: props.getStore().savedToCloud
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // _isValidated() {}

  render() {
    const showSavedCls = (this.state.savedToCloud) ? 'show' : 'hide';

    return (
      <div className="step step4">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
                <label className="md-col-12 control-label">
                  <h1>Thanks!</h1>
                  <h2 className={showSavedCls}>Data was successfully saved to cloud...</h2>
                </label>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
