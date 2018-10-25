'use strict';

import React, { Component } from 'react';

export default class Step6 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedToCloud: props.getStore().savedToCloud
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  render() {
    return (
      <div className="step step6">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                {
                  (this.state.savedToCloud)
                  ?
                    <div>
                      <h1>{this.props.t("step6Head")}</h1>
                      <h2>{this.props.t("step6DataUploaded")}</h2>
                    </div>
                  :
                    <h1>{this.props.t("step6GoBack1")} <a onClick={() => {this.props.jumpToStep(4)}}>{this.props.t("step6GoBack2")}</a> {this.props.t("step6GoBack3")}</h1>
                }
              </label>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
