import adminClients from "./admin/clients.js";
import adminPayments from "./admin/payments.js";
import appSeasons from "./app/seasons.js";
import appClients from "./app/clients.js";
import appMailer from "./app/mailer.js";
import clients from "./clients.js";
import payments from "./payments.js";

export const adminRoutes = { adminClients, adminPayments };

export const appRoutes = { appClients, appMailer, appSeasons };

export default {
  clients,
  payments,
};
