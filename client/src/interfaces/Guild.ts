interface Guild {
  _id: string;
  name: string;
  region: string;
  avatar: string | null;
  channel_ids: string[];
  category_ids: string[];
  channels: Channel[] | null;
  created_at: number;
  categories: {
    categoryChannels: Category[];
    noCategoryChannels: Category[];
  };
}

export interface Category extends Channel {
  channels: Channel[];
}

export interface Channel {
  _id: string;
  guild_id: string;
  name: string;
  parent_id: string;
  topic: string;
  nsfw: boolean;
  created_at: number;
}

export default Guild;
