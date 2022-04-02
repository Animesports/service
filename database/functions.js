import { Connection } from "./connection.js";
Connection.check();

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

export function updateClient({ id, props }) {
  return new Promise((resolve, reject) => {
    Connection.clients.updateOne({ id }, { $set: props }).then(resolve, reject);
  });
}

export function removeClient({ email, name }) {
  return new Promise((resolve, reject) => {
    Connection.clients
      .deleteOne({ "data.email.address": email })
      .then(resolve, reject);
  });
}

export function validateClient({ id }) {
  // Validar um id ou verificar sua existência no Banco
  return new Promise((resolve, reject) => {
    Connection.clients.findOne({ id }).then((client) => {
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
