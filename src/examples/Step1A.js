'use strict';

import React from 'react';

const Step1A = () => (
    <div className="step step1A">
      <div className="row">
        <form id="Form" className="form-horizontal">
          <div className="form-group">
            <label className="col-md-12 control-label">
              <h1>Step 1A: Pure Component Example</h1>
            </label>
            <div className="row">
              <div className="col-md-12">
                  You can use a Pure Componenet as well, but you will not get access to the jumpToStep() utility! (which is only available on regular React Components)
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
)

export default Step1A;
