import { ACTION_TYPE } from '../actions';

const initialState = {
  insulinCoefficient: 0,
  compensationCoefficient: 0,
  targetSugar: 0,
  dailyDoseOfInsulin: 0,
  userName: '',
  weight: 0,
  rounding: 'off',
  carbohydratesIn1Unit: 0,
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_USER_SETTINGS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
