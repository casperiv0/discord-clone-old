import * as React from "react";
import { connect } from "react-redux";
import Guild, { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { createMessage } from "../../lib/actions/message";
import PlusIcon from "../icons/PlusIcon";
import Loader from "../loader";
import "./styles.scss";

interface Props {
  channel: Channel | null;
  guild: Guild | null;
  createMessage: (message: string, guildId: string, channelId: string) => Promise<boolean>;
}

const CreateMessageContainer: React.FC<Props> = ({ channel, guild, createMessage }) => {
  const [content, setContent] = React.useState("");
  const [state, setState] = React.useState<string | null>(null);

  React.useEffect(() => () => setState(null));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setContent("");

    if (!channel?._id) return;
    if (!guild?._id) return;

    await createMessage(content, guild?._id, channel?._id);

    setState(null);
  }

  return (
    <div className="create-message-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          state !== "loading" && onSubmit(e);
        }}
      >
        {state === "loading" ? (
          <div className="create-message-loader">
            <Loader />
          </div>
        ) : null}
        <button className="icon-container">
          <PlusIcon />
        </button>

        <input
          className="create-message-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message #${channel?.name}`}
        />
      </form>
    </div>
  );
};

const mapToProps = (state: State) => ({
  channel: state.channel.channel,
  guild: state.guild.guild,
});

export default connect(mapToProps, { createMessage })(CreateMessageContainer);
