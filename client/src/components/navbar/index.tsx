import { FC } from "react";
import { connect } from "react-redux";
import Guild, { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import HashIcon from "../icons/HashIcon";
import "./styles.scss";

interface Props {
  guild: Guild | null;
  channel: Channel | null;
}

const Navbar: FC<Props> = ({ guild, channel }) => {
  return (
    <nav className="navbar">
      <div className="guild_title">{guild?.name}</div>
      <div className="channel_info">
        <HashIcon /> <span className="channel_name">{channel?.name?.toLowerCase()}</span>
        {channel?.topic !== null ? (
          <>
            {/* TODO: add modal here for topic */}
            <div className="channel_name_divider"></div> {channel?.topic}
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

export default connect(mapToProps)(Navbar);
