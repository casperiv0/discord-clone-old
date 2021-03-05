import * as React from "react";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";
import State from "../../interfaces/State";
import { getMessages } from "../../lib/actions/message";
import socket from "../../lib/socket";
import CreateMessageContainer from "../create-message";
import Loader from "../loader";
import "./styles.scss";

interface Props {
  messages: Message[];
  loading: boolean;
  guildId: string | undefined;
  channelId: string | undefined;
  getMessages: (guildId: string, channelId: string) => void;
}

const MessagesList: React.FC<Props> = ({
  messages: ApiMessages,
  guildId,
  channelId,
  loading,
  getMessages,
}) => {
  const [messages, setMessages] = React.useState<Message[]>(ApiMessages);

  React.useEffect(() => {
    socket.on("messageCreate", (message: Message) => {
      setMessages((prev) => [...prev, message]);

      const messagesContainer = document.querySelector(".messages");
      if (!messagesContainer) return;

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }, []);

  // TODO: make sure user is always scrolled to the bottom on page load

  React.useEffect(() => {
    setMessages(ApiMessages);

    setTimeout(() => {
      const messagesContainer = document.querySelector(".messages");
      if (!messagesContainer) return;

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 200);
  }, [ApiMessages]);

  React.useEffect(() => {
    if (!guildId) return;
    if (!channelId) return;
    getMessages(guildId, channelId);
  }, [getMessages, guildId, channelId]);

  if (loading) {
    return (
      <div className="loading-center loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="messages_list">
      <div className="messages">
        {messages.map((message) => {
          return <MessageItem key={message._id} message={message} />;
        })}
      </div>
      <CreateMessageContainer />
    </div>
  );
};

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="message-item">
      <div className="avatar">
        <img src="https://cdn.discordapp.com/embed/avatars/0.png" />
      </div>

      <div className="content">
        <header>{message.author.username}</header>
        <div>{message.content}</div>
      </div>
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
