import { FC, lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import store from "./lib/store";

const LoginPage = lazy(() => import("./pages/auth/login"));
const RegisterPage = lazy(() => import("./pages/auth/register"));
const GuildPage = lazy(() => import("./pages/guild"));
const ChannelSettingsPage = lazy(() => import("./pages/channel-settings"));

const App: FC = () => {
  return (
    <Router>
      <Suspense fallback={<p>Loading...</p>}>
        <Provider store={store}>
          <Switch>
            <Route path="/login" exact component={LoginPage} />
            <Route path="/register" exact component={RegisterPage} />

            <AuthRoute
              path="/channels/:guild_id/:channel_id/settings"
              component={ChannelSettingsPage}
            />
            <AuthRoute path="/channels/:guild_id/:channel_id" component={GuildPage} />
          </Switch>
        </Provider>
      </Suspense>
    </Router>
  );
};

export default App;
