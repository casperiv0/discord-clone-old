import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import { createGuild, joinGuild, ReturnGuildType } from "../../lib/actions/guild";
import { closeModal } from "../../utils/utils";
import ErrorMessage from "../error-message";
import Loader from "../loader";
import Modal from "./index";

interface Props {
  error: string | null;
  user: User | null;
  guild_id: string | undefined;
  createGuild: (data: unknown) => Promise<ReturnGuildType | undefined>;
  joinGuild: (code: string) => Promise<ReturnGuildType | undefined>;
}

const CreateGuildModal: React.FC<Props> = ({ user, error, guild_id, createGuild, joinGuild }) => {
  const [state, setState] = React.useState<string | null>(null);
  const [name, setName] = React.useState(`${user?.username}'s Server` || "");
  const [type, setType] = React.useState<string | null>(null);
  const history = useHistory();

  React.useEffect(() => {
    if (type === "create") {
      setName(`${user?.username}'s Server` || "");
    } else {
      setName("");
    }
  }, [user?.username, type]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    let data: ReturnGuildType | undefined;
    if (type === "create") {
      data = await createGuild({ name });
    } else if (type === "join") {
      if (!guild_id) return;
      data = await joinGuild(name);
    }

    if (data?.guildId) {
      closeModal("create-guild-modal");

      setState(null);
      return history.push(`/channels/${data.guildId}/${data.channelId}`);
    } else {
      setState("error");
    }
  }

  return (
    <Modal id="create-guild-modal" title="Create a server">
      {type === null ? (
        <>
          <div className="modal_body">
            <div className="select-type">
              <button onClick={() => setType("create")}>Create Server</button>
              <button onClick={() => setType("join")}>Join Server</button>
            </div>
          </div>

          <div className="modal_footer">
            <button onClick={() => closeModal("create-guild-modal")} type="button" className="btn blue">
              Cancel
            </button>
          </div>
        </>
      ) : null}

      {type === "create" ? (
        <>
          <div className="modal_body">
            <form onSubmit={onSubmit} id="create_guild_form">
              {error ? <ErrorMessage message={error} type="warning" /> : null}
              <div className="form_group">
                <label htmlFor="name">Server Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form_input" />
              </div>
            </form>
          </div>

          <div style={{ justifyContent: "space-between" }} className="modal_footer">
            <button className="go-back-btn" onClick={() => setType(null)}>
              Back
            </button>
            <button disabled={state === "loading"} form="create_guild_form" type="submit" className="btn blue">
              {state === "loading" ? <Loader /> : "Create server"}
            </button>
          </div>
        </>
      ) : type === "join" ? (
        <>
          <div className="modal_body">
            <form onSubmit={onSubmit} id="join_guild_form">
              {error ? <ErrorMessage message={error} type="warning" /> : null}
              <div className="form_group">
                <label htmlFor="name">Invite code</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form_input" />
              </div>
            </form>
          </div>

          <div style={{ justifyContent: "space-between" }} className="modal_footer">
            <button className="go-back-btn" onClick={() => setType(null)}>
              Back
            </button>
            <button disabled={state === "loading"} form="join_guild_form" type="submit" className="btn blue">
              {state === "loading" ? <Loader /> : "Join server"}
            </button>
          </div>
        </>
      ) : null}
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.guild.error,
  user: state.auth.user,
  guild_id: state.guild.guild?._id,
});

export default connect(mapToProps, { createGuild, joinGuild })(CreateGuildModal);
