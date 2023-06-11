import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { headerReducer } from "./header";
import { userReducer } from "./user";

const composeEnhancers = 
  (process.env.NODE_ENV !== 'production' && 
    typeof window !== 'undefined' && 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootReducer = combineReducers({
  header: headerReducer,
  users: userReducer,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
)