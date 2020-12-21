import { FC } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Guild, { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import "./styles.scss";

interface Props {
  guild: Guild | null;
}

const GuildChannelList: FC<Props> = ({ guild }) => {
  const params = useParams<{ channel_id: string }>();

  return (
    <div className="guild_channels_list">
      {guild?.channels.map((channel: Channel) => {
        const isActive = params?.channel_id === channel._id;

        return (
          <Link
            className={`guild_channel_item ${isActive ? "active" : ""}`}
            to={`/channels/${guild?._id}/${channel._id}`}
            key={channel._id}
          >
            {channel.name}
          </Link>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  guild: state.guild.guild,
});

export default connect(mapStateToProps)(GuildChannelList);
