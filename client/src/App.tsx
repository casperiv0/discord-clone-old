import { FC, lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import store from "./lib/store";

const LoginPage = lazy(() => import("./pages/auth/login"));
const RegisterPage = lazy(() => import("./pages/auth/register"));
const GuildPage = lazy(() => import("./pages/guild"));

const App: FC = () => {
  return (
    <Router>
      <Suspense fallback={<p>Loading...</p>}>
        <Provider store={store}>
          <Switch>
            <Route path="/login" exact component={LoginPage} />
            <Route path="/register" exact component={RegisterPage} />

            <Route path="/channels/:guild_id/:channel_id" exact component={GuildPage} />
          </Switch>
        </Provider>
      </Suspense>
    </Router>
  );
};

export default App;
