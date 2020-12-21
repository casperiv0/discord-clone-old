import { FC } from "react";
import { connect } from "react-redux";
import { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import Modal from "./index";

interface Props {
  channel: Channel | null;
}

const TopicModal: FC<Props> = ({ channel }) => {
  return (
    <Modal title={`#${channel?.name}`} id="topic-modal">
      <div className="modal_body">{channel?.topic}</div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  channel: state.channel.channel,
});

export default connect(mapToProps)(TopicModal);
