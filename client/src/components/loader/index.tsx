import { FC } from "react";
import { PulseLoader } from "react-spinners";
import "./styles.scss";

interface Props {
  fullScreen?: boolean;
  color?: string;
  size?: number;
}

// TODO: add fullScreen loader
const Loader: FC<Props> = ({ fullScreen, color, size }) => {
  return (
    <div className={fullScreen ? "full-screen" : ""}>
      <PulseLoader color={color ? color : "#fff"} size={size ? size : 10} />
    </div>
  );
};

export default Loader;
