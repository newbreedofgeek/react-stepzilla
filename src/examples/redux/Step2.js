'use strict';

import React from 'react';

const Step2 = ({ activeStep, saySomething, clearSaid, whatsUp }) => (
    <div className="step step2">
      <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>Redux Example - We are in step {activeStep}</h1>
              </label>
              <div className="row">
                <div className="col-md-12">
                  <div className="intro">
                    This example implementation shows StepZilla working with Redux as the datastore. Soruce code is in 'examples/redux'.
                  </div>
                  <div className="btn btn-info" onClick={saySomething}> Say Hello via Redux Action </div>
                  { whatsUp !== '' && <div className="btn btn-warning" onClick={clearSaid}> Clear Hello </div> }
                  <h2>{ whatsUp }</h2>
                </div>
              </div>
            </div>
          </form>
        </div>
    </div>
)

export default Step2;
