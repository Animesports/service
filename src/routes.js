import clients from "./clients.js";

export const appRoutes = [
  ["post", "/clients"],
  ["post", "/clients/validate"],
];

export const adminRoutes = [["delete", "/clients"]];

export default {
  clients,
};
