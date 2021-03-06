import * as React from "react";
import "./styles.scss";
import User from "../../interfaces/User";

interface Props {
  user: User;
  side?: "left" | "right";
  handleHidePopup: () => void;
}

const UserPopup = ({ user, side = "left", handleHidePopup }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const listener = (ev: any) => {
      if (ev.target?.offsetParent?.id === `popup-${user._id}`) return;

      handleHidePopup();
    };

    const container = document.querySelector(".app-container");
    if (!container) return;

    container?.addEventListener("click", listener);
    return () => container?.removeEventListener("click", listener);
  });

  return (
    <div ref={ref} id={`popup-${user._id}`} className="user-popup-container">
      <div id={`popup-${user._id}`} className={`user-popup ${side} active`}>
        <header className="popup-header">
          <div className="avatar">
            <img src="https://cdn.discordapp.com/embed/avatars/0.png" />
          </div>

          <div className="name">
            {user.username}
            {user.discriminator}
          </div>
        </header>
      </div>
    </div>
  );
};

export default UserPopup;
