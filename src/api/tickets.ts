import { API_STR, AUTH_TYPE } from "./auth";

export interface Ticket {
  id: number;
  date: Date;
  userId: number;
  applicationId?: number;
}

export const getTickets = async (token: string): Promise<Ticket[]> =>
  await (
    await fetch(API_STR + "/tickets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${AUTH_TYPE} ${token}`,
      },
    })
  ).json();
