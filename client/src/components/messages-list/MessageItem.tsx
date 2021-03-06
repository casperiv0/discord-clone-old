import * as React from "react";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";
import UserPopup from "../user-popup";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import { deleteMessageById, updateMessageById } from "../../lib/actions/message";
import State from "../../interfaces/State";
import socket from "../../lib/socket";

interface Props {
  deleteMessageById: (messageId: string, channelId: string, guildId: string) => Promise<boolean>;
  updateMessageById: (messageId: string, channelId: string, guildId: string, content: string) => Promise<boolean>;
  message: Message;
  userId: string | undefined;
}

const MessageItem: React.FC<Props> = ({ message, userId, deleteMessageById, updateMessageById }) => {
  const [showPopup, setShowPopup] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>(message.content);

  const handleEdit = React.useCallback(() => {
    if (editing === true) {
      setContent(message.content);
    }
    setEditing((v) => !v);
  }, [editing, message.content]);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        handleEdit();
      }
    };

    if (editing) {
      window.addEventListener("keydown", listener);
    } else {
      window.removeEventListener("keydown", listener);
    }

    return () => window.removeEventListener("keydown", listener);
  }, [editing, handleEdit]);

  React.useEffect(() => {
    socket.on("messageUpdate", (m: Message) => {
      if (message._id === m._id) {
        setContent(m.content);
      }
    });
  }, [message?._id]);

  function handleShow() {
    setShowPopup((v) => !v);
  }

  function deleteMessage() {
    if (!message) return;
    deleteMessageById(message._id, message.channel_id, message.guild_id);
  }

  async function handleUpdateMessage(e: React.FormEvent) {
    e.preventDefault();

    const updated = await updateMessageById(message._id, message.channel_id, message.guild_id, content);

    if (!updated) {
      setEditing(false);
      setContent(message.content);
    } else {
      setEditing(false);
    }
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
          {editing ? (
            <form onSubmit={handleUpdateMessage}>
              <input className="edit-message-input" value={content} onChange={(e) => setContent(e.target.value)} />
            </form>
          ) : (
            <div>{content}</div>
          )}
        </div>

        {message.author._id === userId ? (
          <div className="message-actions">
            <button onClick={handleEdit} className="message-action">
              <EditIcon />
            </button>
            <button onClick={deleteMessage} className="message-action delete">
              <TrashIcon />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

const mapToProps = (state: State) => ({
  userId: state.auth.user?._id,
});

export default connect(mapToProps, { deleteMessageById, updateMessageById })(MessageItem);
