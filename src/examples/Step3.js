'use strict';

import React, { Component, PropTypes } from 'react';

export default class Step3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false
    };

    this.isValidated = this._isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // This review screen had the 'Save' button, on clicking this we SAVE to server via ajax (using an Action of course)
  _isValidated() {
    // typically this private _isValidated os a componenet needs to return true or false (to indicate if the local forms are validated, so StepZilla can move to the next step),
    // but in this example we simulate an ajax request which is async. So we dont return anything (i.e. the return is undefined. This will be treated as "true" by StepZilla)

    this.setState({
      saving: true
    });


    setTimeout(() => {
      this.setState({
        saving: true
      });

      this.props.updateStore({savedToCloud: true});  // Update store here (this is just an example, in reality you will do it via redux or flux)

      // We then explicitly move to the final step (in this case 3 as its a zero based index)
      this.props.jumpToStep(3); // The StepZilla library injects this jumpToStep utility into each component
    }, 1000);
  }

  render() {
    const savingCls = this.state.saving ? 'saving col-md-12 show' : 'saving col-md-12 hide';

    return (
      <div className="step step3 review">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="md-col-12 control-label">
                <h1>Step 3: Review your Details</h1>
              </label>
            </div>
            <div className="form-group">
              <div className="md-col-12 control-label">
                <div className="col-md-12 txt">
                  <div className="col-md-4">
                    Gender
                  </div>
                  <div className="col-md-4">
                    {this.props.getStore().gender}
                  </div>
                </div>
                <div className="col-md-12 txt">
                  <div className="col-md-4">
                    Email
                  </div>
                  <div className="col-md-4">
                    {this.props.getStore().email}
                  </div>
                </div>
                <h2 className={savingCls}>Saving to Cloud, pls wait...</h2>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
