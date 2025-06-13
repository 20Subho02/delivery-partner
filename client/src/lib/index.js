const dev = "http://localhost:5000";
const prod = "http://13.201.73.27:5000";

export const baseURL =
  window.location.hostname.split(":")[0] === "localhost" ||
  window.location.hostname.includes("192")
    ? dev
    : prod;