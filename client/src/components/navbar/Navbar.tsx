import * as React from "react";
import { connect } from "react-redux";
import Guild, { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { deleteGuildById } from "../../lib/actions/guild";
import { openModal } from "../../utils/utils";
import HashIcon from "../icons/HashIcon";
import "./styles.scss";

interface Props {
  guild: Guild | null;
  channel: Channel | null;
  deleteGuildById: (id: string) => Promise<boolean>;
}

const Navbar: React.FC<Props> = ({ guild, channel, deleteGuildById }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.querySelector(".app-container")?.addEventListener("click", () => {
      setOpen(false);
    });
  }, []);

  return (
    <nav className="navbar">
      <div className="guild_title_container">
        <button disabled={!guild?._id} onClick={() => setOpen((v) => !v)} className="guild_title">
          {guild?.name}
        </button>

        <div className={`guild_title_dropdown ${open ? "active" : "closed"}`}>
          <div className="dropdown_content">
            <button className="dropdown_btn">Server Settings</button>
            {/* //TODO: have perms here */}
            <button onClick={() => openModal("create-channel-modal")} className="dropdown_btn">
              Create Channel
            </button>
            <button onClick={() => openModal("create-category-modal")} className="dropdown_btn">
              Create Category
            </button>
            <button onClick={() => deleteGuildById(guild?._id!)} className="dropdown_btn danger">
              Delete guild
            </button>
          </div>
        </div>
      </div>
      <div className="channel_info">
        <HashIcon /> <span className="channel_name">{channel?.name?.toLowerCase()}</span>
        {channel?.topic ? (
          <>
            <div className="channel_name_divider" />
            <button onClick={() => openModal("topic-modal")}>{channel?.topic}</button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

const mapToProps = (state: State) => ({
  guild: state.guild.guild,
  channel: state.channel.channel,
});

export default connect(mapToProps, { deleteGuildById })(Navbar);
