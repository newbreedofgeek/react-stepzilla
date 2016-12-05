'use strict';

import React, { Component, PropTypes } from 'react';

export default class Step1 extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.isValidated = this._isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // This review screen had the 'Save' button, on clicking this we SAVE to server via ajax (using an Action of course)
  _isValidated() {
    alert('Grab data from local store and invoke a SAVE!!!');

    // send the Action to save
    // actions.saveData(store.data);

    // below is just an example of handling the save success, in the real world,
    // We then wait for the save Action to notify this component (via props or flux events), we then explicitly move to the final step (in this case 3 as its a zero based index)
    this.props.jumpToStep(3); // The StepZilla library injects this jumpToStep utility into each component
  }

  render() {
    return (
      <div className="step3">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
                <label className="md-col-12 control-label">
                  <h1> Review!</h1>
                </label>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
