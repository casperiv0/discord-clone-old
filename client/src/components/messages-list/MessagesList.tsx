import * as React from "react";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";
import State from "../../interfaces/State";
import { getMessages } from "../../lib/actions/message";
import socket from "../../lib/socket";
import CreateMessageContainer from "../create-message";
import MessageItem from "./MessageItem";
import Loader from "../loader";
import "./styles.scss";

interface Props {
  messages: Message[];
  loading: boolean;
  guildId: string | undefined;
  channelId: string | undefined;
  getMessages: (guildId: string, channelId: string) => void;
}

const MessagesList: React.FC<Props> = ({ messages: ApiMessages, guildId, channelId, loading, getMessages }) => {
  const [messages, setMessages] = React.useState<Message[]>(ApiMessages);
  const setScrollTop = React.useCallback(() => {
    const messagesContainer = document.querySelector(".messages");
    if (!messagesContainer) return;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, []);

  React.useEffect(() => {
    socket.on("messageCreate", (message: Message) => {
      setMessages((prev) => [...prev, message]);

      setScrollTop();
    });

    socket.on("messageDelete", (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });
  }, [setScrollTop]);

  React.useEffect(() => {
    setMessages(ApiMessages);

    setTimeout(() => {
      setScrollTop();
    }, 100);

    return () => setMessages([]);
  }, [ApiMessages, setScrollTop]);

  React.useEffect(() => {
    if (!guildId) return;
    if (!channelId) return;

    getMessages(guildId, channelId);
  }, [getMessages, guildId, channelId]);

  return (
    <div className="messages_list">
      {loading ? (
        <div className="loading-center loading">
          <Loader />
        </div>
      ) : (
        <div className="messages">
          {messages
            .sort((a, b) => a.created_at - b.created_at)
            .map((message) => {
              return <MessageItem key={message._id} message={message} />;
            })}
        </div>
      )}
      <CreateMessageContainer />
    </div>
  );
};

const mapToProps = (state: State) => ({
  messages: state.message.messages,
  loading: state.message.loading,
  guildId: state.guild.guild?._id,
  channelId: state.channel.channel?._id,
});

export default connect(mapToProps, { getMessages })(MessagesList);
