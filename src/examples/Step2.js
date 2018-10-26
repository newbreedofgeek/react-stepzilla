'use strict';

import React from 'react';

const Step2 = (props) => (
    <div className="step step2">
      <div className="row">
        <form id="Form" className="form-horizontal">
          <div className="form-group">
            <label className="col-md-12 control-label">
              <h1>Step 2: Pure Component Example</h1>
            </label>
            <div className="row content">
              <div className="col-md-12">
                  You can use Pure React Components as well (as of v4.2.0)!
                  <br /><br />
                  <span className="red">... but you cant provide validation logic here (i.e. you cant specify an <span className="bold">isValidated()</span> method and have StepZilla use that to determine if it can move to the next step). This is a limitation of using a Pure Component.</span>
                  <br /><br />
                  <span className="green">... so use a Pure Component if you just want to show some presentation content and a regular React Component (which extends from React.Component) if you need to provide Component level validation checkpoints via <span className="bold">isValidated()</span>.</span>
              </div>
              <div className="col-md-12 eg-jump-lnk">
                <a href="#" onClick={() => props.jumpToStep(0)}>e.g. showing how we use the jumpToStep method helper method to jump back to step 1</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
)

export default Step2;
