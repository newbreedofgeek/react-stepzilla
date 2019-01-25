export const sayHello = () => ({
  type: "HELLO_REDUX"
});

export const clearHello = () => ({
  type: "BYE_REDUX"
});

export const updateActiveStep = (activeStep) => ({
  type: "UPDATE_ACTIVE_STEP",
  payload: activeStep
});