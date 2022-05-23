import adminClients from "./admin/clients.js";
import adminPayments from "./admin/payments.js";
import adminSoccer from "./admin/soccer.js";
import appSeasons from "./app/seasons.js";
import appClients from "./app/clients.js";
import appMailer from "./app/mailer.js";
import appSoccer from "./app/soccer.js";
import clients from "./clients.js";
import payments from "./payments.js";
import soccer from "./soccer.js";
import notifications from "./notifications.js";
import appNotifications from "./app/notifications.js";

export const adminRoutes = { adminClients, adminPayments, adminSoccer };

export const appRoutes = {
  appClients,
  appMailer,
  appSeasons,
  appSoccer,
  appNotifications,
};

export default {
  clients,
  payments,
  soccer,
  notifications,
  appNotifications,
};
