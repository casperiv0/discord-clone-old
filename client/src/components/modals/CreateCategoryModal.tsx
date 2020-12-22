import { FC, FormEvent, useState } from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import Modal from "./index";
import { createCategory } from "../../lib/actions/channel";
import { getGuildById } from "../../lib/actions/guild";
import { useParams } from "react-router-dom";
import ErrorMessage from "../error-message";

interface Props {
  error: string | null;
  createCategory: (name: string, guildId: string) => void;
  getGuildById: (id: string) => void;
}

const CreateCategoryModal: FC<Props> = ({ error, createCategory, getGuildById }) => {
  const [name, setName] = useState<string>("");
  const params = useParams<{ guild_id: string }>();

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    createCategory(name, params.guild_id);

    setTimeout(() => {
      getGuildById(params.guild_id);
    }, 500);
  }

  return (
    <Modal title="Create Category" id="create-category-modal">
      <div className="modal_body">
        <form id="create_category_form" onSubmit={onSubmit}>
          {error ? <ErrorMessage message={error} type="warning" /> : null}
          <div className="form_group">
            <label htmlFor="name">category name</label>
            <input
              id="name"
              placeholder="New category"
              className="form_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="modal_footer">
        <button form="create_category_form" className="btn blue">
          Create Category
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.channel.error,
});

export default connect(mapToProps, { createCategory, getGuildById })(CreateCategoryModal);
