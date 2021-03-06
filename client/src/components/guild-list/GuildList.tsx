import * as React from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { openModal } from "../../utils/utils";
import "./styles.scss";

interface Props {
  guilds: Guild[];
}

const GuildList: React.FC<Props> = ({ guilds }) => {
  const match = useParams<{ guild_id: string }>();

  return (
    <div className="guild_list">
      {/* <Link to="/channels/@me" className="guild_list_item">
        ME
      </Link> */}
      <div className="guild_list_item">ME</div>
      <span className="divider"></span>
      {guilds.map((guild: Guild) => {
        const isActive = match?.guild_id === guild?._id;

        return (
          <Link
            className={`guild_list_item ${isActive ? "active" : ""}`}
            key={guild._id}
            to={`/channels/${guild?._id}/${guild?.channel_ids?.[0]}`}
          >
            {guild?.name?.split("")[0]}
          </Link>
        );
      })}
      <button
        onClick={() => openModal("create-guild-modal")}
        id="create_join_guild"
        className="guild_list_item special"
      >
        +
      </button>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  guilds: state.guild.guilds,
});

export default connect(mapStateToProps)(GuildList);
