import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import store from "./lib/store";
import "./lib/socket";

const LoginPage = React.lazy(() => import("./pages/auth/login"));
const RegisterPage = React.lazy(() => import("./pages/auth/register"));
const GuildPage = React.lazy(() => import("./pages/guild"));
const ChannelSettingsPage = React.lazy(() => import("./pages/channel-settings"));

const App: React.FC = () => {
  return (
    <Router>
      <Provider store={store}>
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />

          <AuthRoute path="/channels/:guild_id/:channel_id/settings" component={ChannelSettingsPage} />
          <AuthRoute path="/channels/:guild_id/:channel_id" component={GuildPage} />
        </Switch>
      </Provider>
    </Router>
  );
};

export default App;
