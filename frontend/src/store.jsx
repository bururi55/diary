import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import {
  userReducer,
  usersReducer,
  appReducer,
  advicesReducer,
  productReducer,
} from './reducers';

const reducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  app: appReducer,
  advices: advicesReducer,
  products: productReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk))
);
