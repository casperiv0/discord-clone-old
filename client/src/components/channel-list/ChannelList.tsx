import * as React from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import Guild, { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { openModal } from "../../utils/utils";
import CogIcon from "../icons/CogIcon";
import PlusIcon from "../icons/PlusIcon";
import "./styles.scss";
import { updateChannel } from "../../lib/actions/channel";

interface Props {
  guild: Guild | null;
  updateChannel: (channelId: string, guildId: string, data: Partial<Channel>) => void;
}

const GuildChannelList: React.FC<Props> = ({ guild, updateChannel }) => {
  const params = useParams<{ channel_id: string }>();
  const [channels, setChannels] = React.useState(guild?.channels);

  const findChannel = React.useCallback(
    (id: string) => {
      return channels?.find((ch) => ch._id === id);
    },
    [channels],
  );

  React.useEffect(() => {
    setChannels(guild?.channels);
  }, [guild?.channels]);

  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      const newIndex = result.destination?.index;
      const channelId = result.draggableId;

      if (!newIndex || !channelId) return console.warn("Cannot find that channel");

      const ch = findChannel(channelId);
      if (newIndex === ch?.position) return;
      if (!guild?._id) return;

      if (ch) {
        const newCh = {
          ...ch,
          position: newIndex,
        };

        setChannels((prev) => {
          if (!prev) return prev;

          return [
            ...prev?.filter((ch) => ch._id !== channelId),
            {
              ...ch,
              position: newIndex,
            },
          ];
        });

        updateChannel(channelId, guild?._id, newCh);
      }
    },
    [findChannel, guild?._id, updateChannel],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="guild_channels_list">
        <Droppable type="channel" droppableId={`channel-list-${guild?._id}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {channels
                ?.sort((a, b) => a.position - b.position)
                ?.map((channel) => {
                  const isActive = channel.type === 1 && channel._id === params.channel_id;

                  return (
                    <div key={channel?._id} className={channel.type === 2 ? "category" : ""}>
                      {channel.type === 1 ? (
                        <ChannelItem
                          index={channel.position}
                          key={channel._id}
                          channel={channel}
                          guildId={guild?._id!}
                          isActive={isActive}
                        />
                      ) : channel.type === 2 ? (
                        <CategoryTitle name={channel?.name} categoryId={channel?._id} />
                      ) : (
                        <p>incorrect channel type</p>
                      )}
                    </div>
                  );
                })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

interface ChannelProps {
  guildId: string;
  channel: Channel;
  isActive: boolean;
  index: number;
}

const ChannelItem: React.FC<ChannelProps> = ({ index, guildId, channel, isActive }) => {
  return (
    <Draggable key={channel._id} index={index} draggableId={`${channel._id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className={`guild_channel_item ${isActive ? "active" : ""}`}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Link to={`/channels/${guildId}/${channel?._id}`}>{channel?.name}</Link>
          <Link to={`/channels/${guildId}/${channel?._id}/settings`} className="manage-channel">
            <CogIcon />
          </Link>
        </div>
      )}
    </Draggable>
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

const Memoized = React.memo(GuildChannelList);

export default connect(mapStateToProps, { updateChannel })(Memoized);
