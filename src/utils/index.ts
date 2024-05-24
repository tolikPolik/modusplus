export const accessToken = {
  get value(): string {
    return getCookie("access_token") || "";
  },

  set value(value: string) {
    document.cookie = "access_token=" + value;
  },
};

const getCookie = (value: string): string | null =>
  (
    document.cookie.match("(^|; )" + encodeURIComponent(value) + "=([^;]+)") ||
    []
  ).pop() || null;
