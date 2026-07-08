import { combineReducers } from "redux";
import weatherReducer from "./weatherReducer";
import authReducer from "./authReducer";
import uiReducer from "./uiReducer";

const rootReducer = combineReducers({
  weather: weatherReducer,
  auth: authReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
