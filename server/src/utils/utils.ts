import GuildModel from "../models/Guild.model";
import UserModel from "../models/User.model";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const errorObj = (error: string): { error: typeof error; status: "error" } => {
  return {
    error: error,
    status: "error",
  };
};

export function createDiscriminator(): string {
  const arr: number[] = [];

  for (let i = 0; i < 4; i++) {
    const num = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

    arr.push(num);
  }

  return `#${arr.join("")}`;
}

export async function isUserAndChannelInGuild(
  userId: string | undefined,
  channelId: string,
  guildId: string
): Promise<string | true> {
  try {
    const user = await UserModel.findById(userId);

    if (!user?.guilds.includes(guildId)) {
      return "You are not in this guild";
    }

    const guild = await GuildModel.findById(guildId);

    if (!guild?.channel_ids.includes(channelId)) {
      return "This channel does not exist in this guild";
    }

    return true;
  } catch (e) {
    console.error(e);
    return "An error occurred";
  }
}
