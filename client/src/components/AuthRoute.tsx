import { FC, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect, RouteChildrenProps } from "react-router-dom";
import State from "../interfaces/State";
import { checkAuth } from "../lib/actions/auth";
import Loader from "./loader";

interface Props {
  component: any;
  isAuth: boolean;
  loading: boolean;
  checkAuth: () => void;
  path: string;
  user_id: string | null;
}

const AuthRoute: FC<Props> = ({
  path,
  component: Component,
  isAuth,
  loading,
  checkAuth,
  user_id,
}) => {
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <Loader color="#7289DA" size={15} fullScreen />;

  return (
    <Route
      path={path}
      exact
      render={(props: RouteChildrenProps) =>
        user_id !== null && isAuth ? <Component {...props} /> : <Component {...props} />
      }
    />
  );
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
  user_id: state.auth.user_id,
});

export default connect(mapToProps, { checkAuth })(AuthRoute);
