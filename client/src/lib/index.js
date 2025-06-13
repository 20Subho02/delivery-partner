const dev = "http://localhost:5000";
const prod = "http://13.204.88.249:5000";

export const baseURL =
  window.location.hostname.split(":")[0] === "localhost" ||
  window.location.hostname.includes("192")
    ? dev
    : prod;