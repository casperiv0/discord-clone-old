import * as React from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Guild, { Category, Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { openModal } from "../../utils/utils";
import CogIcon from "../icons/CogIcon";
import PlusIcon from "../icons/PlusIcon";
import "./styles.scss";

interface Props {
  guild: Guild | null;
}

const GuildChannelList: React.FC<Props> = ({ guild }) => {
  const params = useParams<{ channel_id: string }>();

  return (
    <div className="guild_channels_list">
      {guild?.categories?.noCategoryChannels?.map((category: Category, idx: number) => {
        return (
          <div key={idx} className="category">
            {category.channels.map((channel: Channel) => {
              const isActive = params?.channel_id === channel?._id;

              return (
                <div
                  className={`guild_channel_item ${isActive ? "active" : ""}`}
                  key={channel?._id}
                >
                  <Link to={`/channels/${guild?._id}/${channel?._id}`}>{channel?.name}</Link>
                  <Link
                    to={`/channels/${guild?._id}/${channel?._id}/settings`}
                    className="manage-channel"
                  >
                    <CogIcon />
                  </Link>
                </div>
              );
            })}
          </div>
        );
      })}
      {guild?.categories?.categoryChannels?.map((category: Category) => {
        return (
          <div key={category?._id} className="category">
            <CategoryTitle name={category?.name} categoryId={category?._id} />
            {category.channels.map((channel: Channel) => {
              const isActive = params?.channel_id === channel?._id;
              return (
                <div
                  className={`guild_channel_item ${isActive ? "active" : ""}`}
                  key={channel?._id}
                >
                  <Link to={`/channels/${guild?._id}/${channel?._id}`}>{channel?.name}</Link>
                  <Link
                    to={`/channels/${guild?._id}/${channel?._id}/settings`}
                    className="manage-channel"
                  >
                    <CogIcon />
                  </Link>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const CategoryTitle: React.FC<{ name: string; categoryId: string }> = ({ categoryId, name }) => {
  function createChannel() {
    openModal("create-channel-modal", { category_id: categoryId });
  }

  return (
    <div className="category_title">
      <h3>{name}</h3>

      <button onClick={createChannel}>
        <PlusIcon />
      </button>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  guild: state.guild.guild,
});

export default connect(mapStateToProps)(GuildChannelList);
