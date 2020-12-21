import Guild, { Channel } from "../interfaces/Guild";

const guilds: Guild[] = [
  {
    id: "00000",
    name: "First guild",
    region: "europe",
    avatar: null,
  },
  {
    id: "11111",
    name: "Second guild",
    region: "europe",
    avatar: null,
  },
  {
    id: "22222",
    name: "Third guild",
    region: "europe",
    avatar: null,
  },
  {
    id: "33333",
    name: "Fourth guild",
    region: "europe",
    avatar: null,
  },
];

export const channels: Channel[] = [
  {
    id: "00000",
    name: "hello world",
    nsfw: false,
    guild_id: "00000",
    parent_id: "00000",
    topic: "This is an awesome channel topic",
  },
  {
    id: "11111",
    name: "hello world",
    nsfw: false,
    guild_id: "00000",
    parent_id: "00000",
    topic: "This is an awesome channel topic",
  },
  {
    id: "22222",
    name: "hello world",
    nsfw: false,
    guild_id: "00000",
    parent_id: "00000",
    topic: "This is an awesome channel topic",
  },
  {
    id: "33333",
    name: "hello world",
    nsfw: false,
    guild_id: "00000",
    parent_id: "00000",
    topic: "This is an awesome channel topic",
  },
  {
    id: "44444",
    name: "hello world",
    nsfw: false,
    guild_id: "00000",
    parent_id: "00000",
    topic: "This is an awesome channel topic",
  },
  {
    id: "55555",
    name: "hello world",
    nsfw: false,
    guild_id: "00000",
    parent_id: "00000",
    topic: "This is an awesome channel topic",
  },
];

export default guilds;
