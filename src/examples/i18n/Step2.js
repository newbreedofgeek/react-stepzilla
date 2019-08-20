'use strict';

import React from 'react';

const Step2 = (props) => (
    <div className="step step2">
      <div className="row">
        <form id="Form" className="form-horizontal">
          <div className="form-group">
            <label className="col-md-12 control-label">
              <h1>{props.t("step2Head")}</h1>
            </label>
            <div className="row content">
              <div className="col-md-12">
                  {props.t("step2PureComponents")}
                  <br /><br />
                  <span className="red">{props.t("step2ValidationLogic")} <span className="bold">isValidated()</span> {props.t("step2Limitation")}</span>
                  <br /><br />
                  <span className="green">{props.t("step2Checkpoint")} <span className="bold">isValidated()</span>.</span>
              </div>
              <div className="col-md-12 eg-jump-lnk">
                <a href="#" onClick={() => props.jumpToStep(0)}>{props.t("step2JumpTo1")}</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
)

export default Step2;
