import { FC } from "react";
import GuildChannelList from "../../components/channel-list";
import GuildList from "../../components/guild-list";

const GuildPage: FC = () => {
  return (
    <div className="app-container">
      <GuildList />
      <GuildChannelList />
      <div>messages</div>
      <div>member list</div>
    </div>
  );
};

export default GuildPage;
