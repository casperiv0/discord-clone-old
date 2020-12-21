interface Guild {
  _id: string;
  name: string;
  region: string;
  avatar: string | null;
  channel_ids: string[];
  channels: Channel[];
}

export interface Channel {
  _id: string;
  guild_id: string;
  name: string;
  parent_id: string;
  topic: string;
  nsfw: boolean;
}

export default Guild;
