import { ACTION_TYPE } from '../actions';

const initialState = {
  advices: [],
};

export const advicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_ADVICES:
      return {
        ...state,
        advices: action.payload,
      };
    default:
      return state;
  }
};
