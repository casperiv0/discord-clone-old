import { FC } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import "./styles.scss";

interface Props {
  guilds: Guild[];
}

const GuildList: FC<Props> = ({ guilds }) => {
  return (
    <div className="guild_list">
      <Link to="/channels/@me" className="guild_list_item">
        ME
      </Link>
      <span className="divider"></span>
      {guilds.map((guild: Guild) => {
        return (
          <Link className="guild_list_item" key={guild.id} to={`/channels/${guild.id}/00000`}>
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
