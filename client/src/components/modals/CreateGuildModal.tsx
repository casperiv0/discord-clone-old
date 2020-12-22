import { FC, FormEvent, useState } from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import { createGuild } from "../../lib/actions/guild";
import ErrorMessage from "../error-message";
import Modal from "./index";

interface Props {
  error: string | null;
  createGuild: (data: unknown) => void;
}

const CreateGuildModal: FC<Props> = ({ error, createGuild }) => {
  const [name, setName] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    createGuild({ name });
  }

  return (
    <Modal id="create-guild-modal" title="Create a server">
      <div className="modal_body">
        <form onSubmit={onSubmit} id="create_guild_form">
          {error ? <ErrorMessage message={error} type="warning" /> : null}
          <div className="form_group">
            <label htmlFor="name">Server Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form_input"
            />
          </div>
        </form>
      </div>

      <div className="modal_footer">
        <button form="create_guild_form" type="submit" className="btn blue">
          Create server
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.guild.error,
});

export default connect(mapToProps, { createGuild })(CreateGuildModal);
