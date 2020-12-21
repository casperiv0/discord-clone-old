import { FC, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import GuildChannelList from "../../components/channel-list";
import GuildList from "../../components/guild-list";
import NavBar from "../../components/navbar";
import { getChannelById } from "../../lib/actions/channel";
import { getGuildById, getUserGuilds } from "../../lib/actions/guild";

interface Props {
  getUserGuilds: () => void;
  getGuildById: (id: string) => void;
  getChannelById: (channelId: string, guildId: string) => void;
}

const GuildPage: FC<Props> = ({ getUserGuilds, getGuildById, getChannelById }) => {
  const match = useParams<{ channel_id: string; guild_id: string }>();

  useEffect(() => {
    getUserGuilds();
    getGuildById(match.guild_id);
    getChannelById(match.channel_id, match.guild_id);
  }, [getUserGuilds, getGuildById, getChannelById, match]);

  return (
    <div className="app-container">
      <GuildList />
      <NavBar />
      <GuildChannelList />
      <div style={{ gridArea: "messages" }}>messages</div>
      <div style={{ gridArea: "members" }}>member list</div>
    </div>
  );
};

export default connect(null, { getUserGuilds, getGuildById, getChannelById })(GuildPage);
