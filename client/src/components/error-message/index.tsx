import { FC } from "react";
import "./styles.scss";

interface Props {
  message: string;
  type: "warning" | "error" | "success";
}

const ErrorMessage: FC<Props> = ({ message, type }) => {
  return (
    <div className={`error-message ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
