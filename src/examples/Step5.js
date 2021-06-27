import React, {useState, forwardRef, useImperativeHandle} from 'react';

// We need to wrap component in `forwardRef` in order to gain
// access to the ref object that is assigned using the `ref` prop.
// This ref is passed as the second parameter to the function component.
const HooksWithValidation = forwardRef(({jumpToStep}, ref) => {
  const [valid, setValid] = useState(false);
  const [uiError, setUiError] = useState(false);
  
  const toggleValidState = () => {
    setUiError(false);
    setValid(!valid);
  }

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    isValidated() {
      if (!valid) {
        setUiError(true);
        return false;
      } else {
        // all good, let's proceed
        return true;
      }
    }
  }));

  return <div className="step step5">
    <div className="row">
      <form id="Form" className="form-horizontal">
        <div className="form-group">
          <label className="col-md-12 control-label">
            <h1>Step 5: A React Hooks Component Example (with state based validation)</h1>
          </label>
          <div className="row content">
            <div className="col-md-12">
              <br />
              <span>My validation state is {valid.toString().toUpperCase()}.</span>
              {!valid && <><br /><br /><span className="red">If you want to move to the "Next" step you need change the validation state to TRUE. This demonstrates how a modern Hooks based React component can use the <u>isValidated</u> method to instruct StepZilla to proceed to "Next". Use the button below to toggle it to TRUE.</span></>}
              <br /><br />
              <div className="btn btn-info" onClick={toggleValidState} style={{marginLeft: '0'}}>Toggle Validation State</div>
              {uiError && <div className="val-err-tooltip" style={{marginTop: '1rem', display: 'table'}}>You need to use the the toggle button above to set validation state to TRUE to proceed</div>}
            </div>
            <div className="col-md-12 eg-jump-lnk">
              <a href="#" onClick={() => jumpToStep(0)}>e.g. showing how we use the jumpToStep method helper method to jump back to step 1</a>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
});

export default HooksWithValidation;
