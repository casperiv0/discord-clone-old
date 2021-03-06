import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import { createGuild } from "../../lib/actions/guild";
import { closeModal } from "../../utils/utils";
import ErrorMessage from "../error-message";
import Loader from "../loader";
import Modal from "./index";

interface Props {}

const InviteModal: React.FC<Props> = () => {
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState<string | null>(null);

  function copyToClipboard() {}

  return (
    <Modal id="invite-modal" title="Get invite code">
      <div className="modal_body">
        <div className="form_group">
          <input onSelect={copyToClipboard} defaultValue={code} type="text" className="form_input" />
        </div>
      </div>

      <div className="modal_footer">
        <div onClick={() => closeModal("invite-modal")} className="go-back-btn">
          Cancel
        </div>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.guild.error,
  user: state.auth.user,
});

export default connect(mapToProps, { createGuild })(InviteModal);
