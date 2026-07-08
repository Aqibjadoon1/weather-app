import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "@/redux/reducers/rootReducer";

const composeEnhancers =
  (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? (window as unknown as Record<string, unknown>).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose
    : compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
