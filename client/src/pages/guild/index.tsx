import { FC, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import GuildChannelList from "../../components/channel-list";
import GuildList from "../../components/guild-list";
import MessagesList from "../../components/messages-list";
import CreateCategoryModal from "../../components/modals/CreateCategoryModal";
import CreateChannelModal from "../../components/modals/CreateChannelModal";
import CreateGuildModal from "../../components/modals/CreateGuildModal";
import TopicModal from "../../components/modals/TopicModal";
import NavBar from "../../components/navbar";
import { getChannelById } from "../../lib/actions/channel";
import { getGuildById, getUserGuilds } from "../../lib/actions/guild";

interface Props {
  getUserGuilds: () => void;
  getGuildById: (id: string) => void;
  getChannelById: (channelId: string, guildId: string) => void;
}

const GuildPage: FC<Props> = ({
  getUserGuilds,
  getGuildById,
  getChannelById,
}) => {
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
      <MessagesList />
      <div style={{ gridArea: "members" }}>member list</div>

      <TopicModal />
      <CreateCategoryModal />
      <CreateChannelModal />
      <CreateGuildModal />
    </div>
  );
};

export default connect(null, { getUserGuilds, getGuildById, getChannelById })(
  GuildPage
);
