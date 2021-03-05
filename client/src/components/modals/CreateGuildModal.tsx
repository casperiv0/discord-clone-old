import { FC, FormEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import { createGuild } from "../../lib/actions/guild";
import { closeModal } from "../../utils/utils";
import ErrorMessage from "../error-message";
import Loader from "../loader";
import Modal from "./index";

interface Props {
  error: string | null;
  user: User | null;
  createGuild: (data: unknown) => Promise<string | undefined>;
}

const CreateGuildModal: FC<Props> = ({ user, error, createGuild }) => {
  const [state, setState] = useState<string | null>(null);
  const [name, setName] = useState(`${user?.username}'s Server` || "");
  const history = useHistory();

  useEffect(() => {
    setName(`${user?.username}'s Server` || "");
  }, [user?.username]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");

    const guildId = await createGuild({ name });

    if (guildId) {
      closeModal("create-guild-modal");

      setState(null);
      return history.push(`/channels/${guildId}/undefined`);
    } else {
      setState("error");
    }
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
        <button
          disabled={state === "loading"}
          form="create_guild_form"
          type="submit"
          className="btn blue"
        >
          {state === "loading" ? <Loader /> : "Create server"}
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.guild.error,
  user: state.auth.user,
});

export default connect(mapToProps, { createGuild })(CreateGuildModal);
