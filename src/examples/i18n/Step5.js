'use strict';

import React, { Component } from 'react';
import Promise from 'promise';

export default class Step5 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false
    };

    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // This review screen had the 'Save' button, on clicking this is called
  isValidated() {
    /*
    typically this method needs to return true or false (to indicate if the local forms are validated, so StepZilla can move to the next step),
    but in this example we simulate an ajax request which is async. In the case of async validation or server saving etc. return a Promise and StepZilla will wait
    ... for the resolve() to work out if we can move to the next step
    So here are the rules:
    ~~~~~~~~~~~~~~~~~~~~~~~~
    SYNC action (e.g. local JS form validation).. if you return:
    true/undefined: validation has passed. Move to next step.
    false: validation failed. Stay on current step
    ~~~~~~~~~~~~~~~~~~~~~~~~
    ASYNC return (server side validation or saving data to server etc).. you need to return a Promise which can resolve like so:
    resolve(): validation/save has passed. Move to next step.
    reject(): validation/save failed. Stay on current step
    */

    this.setState({
      saving: true
    });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.setState({
          saving: true
        });

        this.props.updateStore({savedToCloud: true});  // Update store here (this is just an example, in reality you will do it via redux or flux)

        // call resolve() to indicate that server validation or other aync method was a success.
        // ... only then will it move to the next step. reject() will indicate a fail
        resolve();
        // reject(); // or reject
      }, 5000);
    });
  }

  jumpToStep(toStep) {
    // We can explicitly move to a step (we -1 as its a zero based index)
    this.props.jumpToStep(toStep-1); // The StepZilla library injects this jumpToStep utility into each component
  }

  render() {
    const savingCls = this.state.saving ? 'saving col-md-12 show' : 'saving col-md-12 hide';

    return (
      <div className="step step5 review">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step5Head")}</h1>
              </label>
            </div>
            <div className="form-group">
              <div className="col-md-12 control-label">
                <div className="col-md-12 txt">
                  <div className="col-md-4">
                    {this.props.t("step5Gender")}
                  </div>
                  <div className="col-md-4">
                    {this.props.getStore().gender}
                  </div>
                </div>
                <div className="col-md-12 txt">
                  <div className="col-md-4">
                    {this.props.t("step5Email")}
                  </div>
                  <div className="col-md-4">
                    {this.props.getStore().email}
                  </div>
                </div>
                <div className="col-md-12 txt">
                  <div className="col-md-4">
                    {this.props.t("step5EmergencyEmail")}
                  </div>
                  <div className="col-md-4">
                    {this.props.getStore().emailEmergency}
                  </div>
                </div>
                <div className="col-md-12 eg-jump-lnk">
                  <a href="#" onClick={() => this.jumpToStep(1)}>{this.props.t("step5JumpTo1")}</a>
                </div>
                <h2 className={savingCls}>{this.props.t("step5Promise")}</h2>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
