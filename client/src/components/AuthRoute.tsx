import { FC, useEffect } from "react";
import { connect } from "react-redux";
import { Route, RouteChildrenProps } from "react-router-dom";
import State from "../interfaces/State";
import { checkAuth } from "../lib/actions/auth";
import Loader from "./loader";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  loading: boolean;
  checkAuth: () => void;
  path: string;
}

const AuthRoute: FC<Props> = ({
  path,
  component: Component,
  loading,
  checkAuth,
}) => {
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <Loader color="#7289DA" size={15} fullScreen />;

  return (
    <Route
      path={path}
      exact
      render={(props: RouteChildrenProps) => <Component {...props} />}
    />
  );
};

const mapToProps = (state: State) => ({
  loading: state.auth.loading,
});

export default connect(mapToProps, { checkAuth })(AuthRoute);
