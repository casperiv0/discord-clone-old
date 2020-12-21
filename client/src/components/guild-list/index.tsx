import { FC } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import "./styles.scss";

interface Props {
  guilds: Guild[];
}

const GuildList: FC<Props> = ({ guilds }) => {
  const match = useParams<{ guild_id: string }>();

  return (
    <div className="guild_list">
      <Link to="/channels/@me" className="guild_list_item">
        ME
      </Link>
      <span className="divider"></span>
      {guilds.map((guild: Guild) => {
        const isActive = match?.guild_id === guild._id;

        return (
          <Link
            className={`guild_list_item ${isActive ? "active" : ""}`}
            key={guild._id}
            to={`/channels/${guild._id}/${guild.channel_ids[0]}`}
          >
            {guild.name.split("")[0]}
          </Link>
        );
      })}
      <button id="create_join_guild" className="guild_list_item special">
        +
      </button>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  guilds: state.guild.guilds,
});

export default connect(mapStateToProps)(GuildList);
