import { API_STR, AUTH_TYPE } from "./auth";
import { Ticket } from "./tickets";

export const addApplication = async (
  description: string,
  ticket: Ticket,
  token: string
) => {
  await fetch(`${API_STR}/applications/${ticket.id}`, {
    body: JSON.stringify({
      description,
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `${AUTH_TYPE} ${token}`,
    },
    method: "POST",
  });
};
