import { ACTION_TYPE } from './action-type';

export const setAdvices = (advices) => ({
  type: ACTION_TYPE.SET_ADVICES,
  payload: advices,
});
