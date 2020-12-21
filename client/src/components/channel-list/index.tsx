import { FC } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Guild, { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import "./styles.scss";

interface Props {
  guild: Guild | null;
  channels: Channel[];
}

const GuildChannelList: FC<Props> = ({ guild, channels }) => {
  return (
    <div className="guild_channels_list">
      {channels.map((channel: Channel) => {
        return (
          <Link className="guild_channel_item" to={`/channels/${guild?.id}/${channel.id}`} key={channel.id}>
            {channel.name}
          </Link>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  guild: state.guild.guild,
  channels: state.guild.channels,
});

export default connect(mapStateToProps)(GuildChannelList);
