import { findClientId } from "../database/functions.js";
import { v5 as uuidv5, v4 as uuidv4 } from "uuid";

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
