import * as React from "react";
import { connect } from "react-redux";
import "./styles.scss";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import UserPopup from "../user-popup";

interface Props {
  members: User[] | undefined;
}

const MemberList: React.FC<Props> = ({ members }) => {
  return (
    <div className="members-list">
      {members?.map((member) => {
        return <MemberItem key={member._id} member={member} />;
      })}
    </div>
  );
};

const MemberItem: React.FC<{ member: User }> = ({ member }) => {
  const [showPopup, setShowPopup] = React.useState(false);

  function handleShowPopup() {
    setShowPopup((v) => !v);
  }

  return (
    <>
      {showPopup ? <UserPopup side="right" handleHidePopup={() => setShowPopup(false)} user={member} /> : null}

      <button onClick={handleShowPopup} key={member._id} className="member-item">
        <div className="avatar">
          <img src="https://cdn.discordapp.com/embed/avatars/0.png" />
        </div>

        <p className="username">{member.username}</p>
      </button>
    </>
  );
};

const mapToProps = (state: State) => ({
  members: state.guild.guild?.members,
});

export default connect(mapToProps)(MemberList);
