import * as React from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import ErrorMessage from "../../components/error-message";
import XIcon from "../../components/icons/XIcon";
import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { deleteGuildById, getGuildById, updateGuildById } from "../../lib/actions/guild";
import "./styles.scss";

interface Props {
  error: string | null;
  guild: Guild | null;
  deleteGuildById: (guildId: string) => Promise<boolean>;
  getGuildById: (guildId: string) => Promise<boolean>;
  updateGuildById: (guildId: string, data: Partial<Guild>) => Promise<boolean>;
}

const GuildSettingsPage: React.FC<Props> = ({ error, guild, getGuildById, deleteGuildById, updateGuildById }) => {
  const { guild_id } = useParams<{
    guild_id: string;
  }>();
  const history = useHistory();
  const [name, setName] = React.useState("");
  const [region, setRegion] = React.useState("");

  const closeSettings = React.useCallback(() => {
    history.goBack();
  }, [history]);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        closeSettings();
      }
    };

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, [closeSettings]);

  React.useEffect(() => {
    getGuildById(guild_id);
  }, [guild_id, getGuildById]);

  React.useEffect(() => {
    if (guild?._id) {
      setName(guild.name);
      setRegion(guild.region || "");
    }
  }, [guild]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateGuildById(guild_id, {
      name,
    });
  }

  async function deleteChannel() {
    if (!guild) return;
    const deleted = await deleteGuildById(guild?._id);

    if (deleted) {
      history.push(`/channels/${guild._id}/${guild.channel_ids[0]}`);
    }
  }

  return (
    <div className="settings_page_container">
      <div className="settings_page_sidebar">
        <div className="settings_page_content">
          <div className="settings_page_sidebar_items">
            <div className="settings_page_item btn dark active">Overview</div>
            <div className="settings_page_divider"></div>
            <button onClick={deleteChannel} className="btn danger">
              Delete Server
            </button>
          </div>
        </div>
      </div>

      <div className="settings_page_overview">
        <div className="settings_page_content">
          <div className="settings_page_title">
            <h3>Server Overview</h3>

            <button onClick={closeSettings} className="settings_page_close">
              <XIcon />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            {error ? <ErrorMessage message={error} type="warning" /> : null}
            <div className="form_group">
              <label htmlFor="channel_name">Server Name</label>
              <input
                id="channel_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form_input"
                maxLength={50}
              />
            </div>
            <div className="form_group">
              <label htmlFor="server_region">Server Region</label>
              <input disabled id="server_region" value={region} className="form_input" maxLength={50} />{" "}
            </div>

            <button className="btn blue submit" type="submit">
              Save settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapToProps = (state: State) => ({
  channel: state.channel.channel,
  error: state.channel.error,
  guild: state.guild.guild,
});

export default connect(mapToProps, { deleteGuildById, getGuildById, updateGuildById })(GuildSettingsPage);
