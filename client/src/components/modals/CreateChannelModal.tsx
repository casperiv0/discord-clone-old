import * as React from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import Modal from "./index";
import { createChannel } from "../../lib/actions/channel";
import { useParams } from "react-router-dom";
import { getGuildById } from "../../lib/actions/guild";
import ErrorMessage from "../error-message";
import { parseChannelName } from "../../utils/utils";

interface Props {
  error: string | null;
  createChannel: (name: string, guildId: string) => void;
  getGuildById: (id: string) => void;
}

const CreateChannelModal: React.FC<Props> = ({ error, createChannel, getGuildById }) => {
  const [chName, setName] = React.useState<string>("");
  const params = useParams<{ guild_id: string }>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createChannel(chName, params.guild_id);

    setName("");

    setTimeout(() => {
      getGuildById(params.guild_id);
    }, 500);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setName(parseChannelName(value));
  }

  return (
    <Modal title="Create Channel" id="create-channel-modal">
      <div className="modal_body">
        <form id="create_channel_form" onSubmit={onSubmit}>
          {error ? <ErrorMessage message={error} type="warning" /> : null}
          <div className="form_group">
            <label htmlFor="name">channel name</label>
            <input
              id="name"
              placeholder="new-channel"
              className="form_input"
              value={chName}
              onChange={handleChange}
              maxLength={50}
            />
          </div>
        </form>
      </div>
      <div className="modal_footer">
        <button form="create_channel_form" className="btn blue">
          Create Channel
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.channel.error,
});

export default connect(mapToProps, { createChannel, getGuildById })(CreateChannelModal);
