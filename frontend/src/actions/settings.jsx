import { ACTION_TYPE } from './action-type';

export const setUserSettings = (settings) => ({
  type: ACTION_TYPE.SET_USER_SETTINGS,
  payload: settings,
});
