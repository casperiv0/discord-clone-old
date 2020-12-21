interface Guild {
  id: string;
  name: string;
  region: string;
  avatar: string | null;
}

export interface Channel {
  id: string;
  guild_id: string;
  name: string;
  parent_id: string;
  topic: string;
  nsfw: boolean;
}

export default Guild;
