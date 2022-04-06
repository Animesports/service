import {
  findClientId,
  searchSessionById,
  validationSearcher,
} from "../database/functions.js";
import { v5 as uuidv5, v4 as uuidv4 } from "uuid";
import TokenGenerator from "uuid-token-generator";

export function generateSessionId({ id }) {
  return new Promise((accept, reject) => {
    let times = 10;

    (async function generate() {
      times--;

      const sessionId = `
      ${uuidv5(id, uuidv4())}
      @
      ${new TokenGenerator(256, TokenGenerator.BASE62).generate()}
      `;

      await searchSessionById({ sessionId }).then((session) => {
        if (!session?.sessionId) return accept(sessionId);
        if (times <= 0) return reject(new Error("max-generate-times"));
        setTimeout(generate, 10);
      });
    })();
  });
}

export function generateCode() {
  return new Promise((accept, reject) => {
    let times = 10;

    (async function generate() {
      times--;
      const code = Math.floor(100000 + Math.random() * 999999).toString();

      await validationSearcher({ code }).then((document) => {
        if (!document?.reference) return accept(code);
        if (times <= 0) return reject(new Error("max-generate-times"));
        setTimeout(generate, 10);
      });
    })();
  });
}

export function generateToken() {
  return new Promise((accept, reject) => {
    let times = 10;

    (async function generate() {
      times--;
      const token = new TokenGenerator(256, TokenGenerator.BASE62).generate();

      await validationSearcher({ token }).then((document) => {
        if (!document?.reference) return accept(token);
        if (times <= 0) return reject(new Error("max-generate-times"));
        setTimeout(generate, 10);
      });
    })();
  });
}

export function generateId({ email }) {
  return new Promise((accept, reject) => {
    let times = 10;

    (async function generate() {
      times--;
      const newId = uuidv5(email, uuidv4());

      await findClientId({ id: newId }).then(({ id }) => {
        if (!id) return accept(newId);
        if (times <= 0) return reject(new Error("max-generate-times"));
        setTimeout(generate, 10);
      });
    })();
  });
}
