import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from './App';
import { RouterProvider} from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { authApi } from "./utils/authApi";

// Restore the session before anything renders a guarded route. The
// cookies are httpOnly, so asking the server is the only way to know;
// an expired access token is refreshed transparently on the way.
appStore.dispatch(authApi.endpoints.getMe.initiate(undefined, { subscribe: false }));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={appStore}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);

// ReactDOM.render(<RouterProvider router={router} />, document.getElementById("root"));
