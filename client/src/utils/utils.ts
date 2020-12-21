import axios, { AxiosPromise, AxiosResponse } from "axios";
import Guild, { Channel } from "../interfaces/Guild";

type AllowedMethods = "GET" | "POST" | "PUT" | "DELETE";

const url = process.env.REACT_APP_API_URL + "/api";

export function handleRequest(
  path: string,
  method: AllowedMethods,
  data?: unknown
): AxiosPromise<{
  status: "error" | "success";
  error: string;
  user_id: string;
  guilds: Guild[];
  guild: Guild;
  channel: Channel;
  [key: string]: unknown;
}> {
  return axios({
    url: `${url}${path}`,
    method,
    data,
    withCredentials: true,
  });
}

export function isSuccess(res: AxiosResponse<{ status: "error" | "success" }>): boolean {
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

export const openModal = (id: string): void => {
  document.querySelector(`#${id}`)?.classList.add("active");
  document.querySelector(`#style-${id}`)?.classList.remove("closed");
  document.querySelector(`#style-${id}`)?.classList.add("active");
};

export const closeModal = (id: string): void => {
  document.querySelector(`#style-${id}`)?.classList.replace("active", "closed");

  setTimeout(() => {
    document.querySelector(`#${id}`)?.classList.remove("active");
  }, 105);
};
