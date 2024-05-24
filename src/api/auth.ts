export const API_STR = "http://localhost:80";
export const AUTH_TYPE = "Bearer";

export interface IUser {
  login: string;
  role: string;
}

export const signIn = async (
  login: string,
  password: string
): Promise<string> => {
  return await (
    await (
      await fetch(API_STR + "/login", {
        body: JSON.stringify({
          login,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json()
  ).access_token;
};

export const getUserInfo = async (token: string): Promise<IUser> => {
  const authorization = `${AUTH_TYPE} ${token}`;
  return (await (
    await fetch(API_STR + "/user-data", { headers: { authorization } })
  ).json()) as IUser;
};
