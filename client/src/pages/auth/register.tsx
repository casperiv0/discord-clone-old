import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/error-message";
import Loader from "../../components/loader";
import State from "../../interfaces/State";
import { register } from "../../lib/actions/auth";
import "./auth.styles.scss";

interface Props {
  error: string | null;
  loading: boolean;
  register: (data: unknown) => void;
}

const RegisterPage: React.FC<Props> = ({ error, loading, register }) => {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    register({ email, username, password, password2 });
  }

  return (
    <div className="auth_container">
      <form onSubmit={onSubmit} className="auth_content">
        <div className="auth_title">
          <h1>Create an account</h1>
        </div>
        {error ? <ErrorMessage message={error} type="warning" /> : null}
        <div className="form_group">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            className="form_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          />
        </div>
        <div className="form_group">
          <label htmlFor="username">Username</label>
          <input className="form_input" value={username} onChange={(e) => setUsername(e.target.value)} id="username" />
        </div>
        <div className="form_group">
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            className="form_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>
        <div className="form_group">
          <label htmlFor="password2">CONFIRM PASSWORD</label>
          <input
            type="password"
            className="form_input"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            id="password2"
          />
        </div>
        <div className="form_group">
          <button className="btn blue auth" type="submit">
            {loading ? <Loader /> : "Continue"}
          </button>
          <small>
            <Link to="/login">Already have an account?</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

const mapToProps = (state: State) => ({
  error: state.auth.error,
  loading: state.auth.loading,
});

export default connect(mapToProps, { register })(RegisterPage);
