const reducer = (state = {say: '', activeStep: 0}, action) => {
  switch (action.type) {
    case 'HELLO_REDUX':
      return { ...state, say : 'Hello World Redux'  };

    case 'BYE_REDUX':
      return { ...state, say : ''  };
    
    case 'UPDATE_ACTIVE_STEP':
      return { ...state, activeStep : action.payload  };

    default:
      return state;
  }
  
};

export default reducer;