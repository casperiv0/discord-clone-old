import axios, { AxiosPromise, AxiosResponse } from "axios";
import Guild, { Channel } from "../interfaces/Guild";
import User from "../interfaces/User";

type AllowedMethods = "GET" | "POST" | "PUT" | "DELETE";

const url = process.env.REACT_APP_API_URL + "/api/v1";

export function handleRequest(
  path: string,
  method: AllowedMethods,
  data?: unknown
): AxiosPromise<{
  status: "error" | "success";
  error: string;
  user: User;
  guilds: Guild[];
  guild: Guild;
  channel: Channel;
  guild_id: string;
  [key: string]: unknown;
}> {
  return axios({
    url: `${url}${path}`,
    method,
    data,
    withCredentials: true,
  });
}

export function isSuccess(
  res: AxiosResponse<{ status: "error" | "success" }>
): boolean {
  return res.data.status && res.data.status === "success";
}

export const openSidebar = (id: string): void => {
  document.querySelector(`#${id}Active`)?.classList.add("active");
  document.querySelector(`#${id}`)?.classList.add("active");
};

export const closeSidebar = (id: string): void => {
  document.querySelector(`#${id}Active`)?.classList.remove("active");
  document.querySelector(`#${id}`)?.classList.remove("active");
};

export const openModal = (id: string, payload?: unknown): void => {
  const element = document.querySelector(`#${id}`);
  element?.classList.add("active");
  element?.setAttribute("data-payload", JSON.stringify(payload));
  document.querySelector(`#style-${id}`)?.classList.remove("closed");
  document.querySelector(`#style-${id}`)?.classList.add("active");
};

export const closeModal = (id: string): void => {
  document.querySelector(`#style-${id}`)?.classList.replace("active", "closed");

  setTimeout(() => {
    document.querySelector(`#${id}`)?.classList.remove("active");
  }, 105);
};

export function parseChannelName(value: string): string {
  // 1st replace: replace space with '-'
  // 2nd replace: replace multiple '-' with 1 '-'
  // 3rd replace: replace a '-' in the beginning with nothing.
  // 4th replace: remove special characters
  // Thanks to: https://youtu.be/3tG1jUQbuSI?t=510

  return value
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-/, "")
    .replace(/[!?&²³,;:%£*$^'"()_M+=[\]/]/g, "");
}
