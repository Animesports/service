import adminClients from "./admin/clients.js";
import appClients from "./app/clients.js";
import appMailer from "./app/mailer.js";
import clients from "./clients.js";
import payments from "./payments.js";

export const adminRoutes = { adminClients };

export const appRoutes = { appClients, appMailer };

export default {
  clients,
  payments,
};
