import { Connection } from "./connection.js";
Connection.check();

export function getAllPayments() {
  return new Promise(async (resolve, reject) => {
    Connection.payments.find().toArray().then(resolve, reject);
  });
}

export function searchPayment({ paymentId }) {
  return new Promise(async (resolve, reject) => {
    Connection.payments
      .findOne({
        id: paymentId,
      })
      .then(resolve, reject);
  });
}

export function deletePayment({ paymentId }) {
  return new Promise(async (resolve, reject) => {
    Connection.payments
      .deleteOne({
        id: paymentId,
      })
      .then(resolve, reject);
  });
}

export function insertNewPayment({ value, paymentId, id }) {
  return new Promise(async (resolve, reject) => {
    const expire = new Date();
    expire.setMonth(expire.getMonth() + 1);

    await Connection.payments.createIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 0 }
    );

    Connection.payments
      .insertOne({
        expireAt: expire,
        logEvent: 1,
        logMessage: "Success!",
        value,
        type: value > 0 ? "receive" : "send",
        verified: false,
        id: paymentId,
        reference: id,
      })
      .then(resolve, reject);
  });
}

export function updatePayment({ paymentId, props }) {
  console.info("updating:", { paymentId, props });
  return new Promise((resolve, reject) => {
    Connection.payments
      .updateOne({ id: paymentId }, { $set: props })
      .then(resolve, reject);
  });
}

export function getAllPaymentWithId({ id }) {
  return new Promise((resolve, reject) => {
    Connection.payments.find({ reference: id }).toArray().then(resolve, reject);
  });
}

export function updateSession({ sessionId, props }) {
  return new Promise((resolve, reject) => {
    Connection.session
      .updateOne({ sessionId }, { $set: props })
      .then(resolve, reject);
  });
}
export function insertNewSession({ sessionId, id, password, email }) {
  return new Promise(async (accept, reject) => {
    const expire = new Date();
    expire.setDate(expire.getDay() + 7);

    await Connection.validation.createIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 0 }
    );

    Connection.session
      .insertOne({
        expireAt: expire,
        logEvent: 1,
        logMessage: "Success!",
        sessionId,
        id,
        password,
        email,
      })
      .then(accept, reject);
  });
}

export function searchSessionById({ sessionId }) {
  return new Promise((accept, reject) => {
    Connection.session.findOne({ sessionId }).then(accept, reject);
  });
}

export function validationSearcher(parameter) {
  return new Promise((accept, reject) => {
    Connection.validation.findOne(parameter).then(accept, reject);
  });
}

export function validationRemove(parameter) {
  return new Promise((accept, reject) => {
    Connection.validation.deleteOne(parameter).then(accept, reject);
  });
}

export function validationCreate({ type, value, reference }) {
  return new Promise(async (accept, reject) => {
    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + 10);

    await Connection.validation.createIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 0 }
    );

    await Connection.validation
      .insertOne({
        expireAt: expire,
        logEvent: 1,
        logMessage: "Success!",
        reference,
        [type]: value,
      })
      .then(accept, reject);
  });
}

export function getAllClients() {
  return new Promise((accept, reject) => {
    Connection.clients.find().toArray().then(accept, reject);
  });
}

export function insertNewClient({ name, email, password, id }) {
  // Inserir um novo client no Banco de dados
  return new Promise((accept, reject) => {
    Connection.clients
      .insertOne({
        id,
        data: {
          name,
          email: {
            address: email,
            verified: false,
          },
          pix: null,
          password,
          admin: false,
        },
        config: {
          twosteps: false,
          video: true,
          darkmode: false,
        },
      })
      .then(accept, reject);
  });
}

export function updateClientByEmail({ email, props }) {
  return new Promise((resolve, reject) => {
    Connection.clients
      .updateOne({ "data.email.address": email }, { $set: props })
      .then(resolve, reject);
  });
}

export function updateClient({ id, props }) {
  return new Promise((resolve, reject) => {
    Connection.clients.updateOne({ id }, { $set: props }).then(resolve, reject);
  });
}

export function removeClient({ email }) {
  return new Promise((resolve, reject) => {
    Connection.clients
      .deleteOne({ "data.email.address": email })
      .then(resolve, reject);
  });
}

export function validateClient({ id, email, password }) {
  // Validar um id ou verificar sua existência no Banco
  return new Promise((resolve, reject) => {
    Connection.clients
      .findOne({ id, "data.email.address": email, "data.password": password })
      .then((client) => {
        resolve({ id: client?.id, admin: client?.data?.admin });
      }, reject);
  });
}

export function validateClientCredentials({ email, password }) {
  // Validar as credenciais ou verificar sua existência no Banco
  return new Promise((resolve, reject) => {
    Connection.clients
      .findOne({ "data.email.address": email, "data.password": password })
      .then((client) => {
        if (!client?.id) return reject("not-found");
        resolve(client);
      }, reject);
  });
}

export function getAllClientDataWithId({ id }) {
  // Encontrar um usuário com o ID e retornar os dados
  return new Promise((accept, reject) => {
    Connection.clients.findOne({ id }).then(accept, reject);
  });
}

export function findClientEmail({ email }) {
  // Encontrar um email na lista de clientes
  return new Promise((accept, reject) => {
    Connection.clients
      .findOne({ "data.email.address": email })
      .then((client) => {
        accept(client?.data.email ?? {});
      }, reject);
  });
}

export function findClientId({ id }) {
  // Encontrar um Id na lista de clientes
  return new Promise((accept, reject) => {
    Connection.clients.findOne({ id }).then((client) => {
      accept({ id: client?.id });
    }, reject);
  });
}
