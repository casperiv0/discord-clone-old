import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import Guild from "../interfaces/Guild";
import State from "../interfaces/State";
import { getUserGuilds } from "../lib/actions/guild";

interface Props {
  guilds: Guild[];
  loading: boolean;
  getUserGuilds: () => void;
}

const IndexPage: React.FC<Props> = ({ loading, guilds, getUserGuilds }) => {
  const history = useHistory();

  React.useEffect(() => {
    getUserGuilds();
  }, [getUserGuilds]);

  React.useEffect(() => {
    if (loading) return;

    if (!guilds[0]) {
      // TODO: add this page
      //   history.push("/@me");
    } else {
      history.push(`/channels/${guilds[0]?._id}/${guilds[0]?.channel_ids[0]}`);
    }
  }, [guilds, history, loading]);

  return null;
};

const mapToProps = (state: State) => ({
  guilds: state.guild.guilds,
  loading: state.guild.loading,
});

export default connect(mapToProps, { getUserGuilds })(IndexPage);
