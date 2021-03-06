import * as React from "react";
import Message from "../../interfaces/Message";
import UserPopup from "../user-popup";
import TrashIcon from "../icons/TrashIcon";
import { connect } from "react-redux";
import { deleteMessageById } from "../../lib/actions/message";

interface Props {
  deleteMessageById: (messageId: string, channelId: string, guildId: string) => Promise<boolean>;
  message: Message;
}

const MessageItem: React.FC<Props> = ({ message, deleteMessageById }) => {
  const [showPopup, setShowPopup] = React.useState(false);

  function handleShow() {
    setShowPopup((v) => !v);
  }

  function deleteMessage() {
    if (!message) return;
    deleteMessageById(message._id, message.channel_id, message.guild_id);
  }

  return (
    <>
      {showPopup ? <UserPopup handleHidePopup={() => setShowPopup(false)} user={message.author} /> : null}
      <div className="message-item">
        <button onClick={handleShow} className="avatar">
          <img src="https://cdn.discordapp.com/embed/avatars/0.png" />
        </button>

        <div className="content">
          <header onClick={handleShow}>{message.author.username}</header>
          <div>{message.content}</div>
        </div>

        <div className="message-actions">
          {/* <button className="message-action delete"></button> */}
          {/* <button className="message-action delete"></button> */}
          <button onClick={deleteMessage} className="message-action delete">
            <TrashIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default connect(null, { deleteMessageById })(MessageItem);
