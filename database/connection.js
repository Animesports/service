import { Db, MongoClient } from "mongodb";

import dotenv from "dotenv";
dotenv.config();

let mongoClient = new MongoClient(process.env.SERVICE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let mongoDb = new Db(mongoClient, "animesports");

export class Connection {
  static async open() {
    try {
      console.info("> DB: Opening a connection");
      this.current = await mongoClient.connect();

      this.db = this.current.db("animesports");

      this.collections();
      return this.cache();
    } catch (err) {
      return console.info("> DB: connection error", err);
    }
  }

  static async check() {
    return this.db && this.current ? this.recycle() : this.open();
  }

  static cache() {
    mongoDb = this.db;
    mongoClient = this.current;
    return this;
  }

  static recycle() {
    this.current = mongoClient;
    this.db = mongoDb;
    return this;
  }

  static collections() {
    this.clients = this.db.collection("clients");
    this.validation = this.db.collection("validation");
    this.session = this.db.collection("session");
    this.seasons = this.db.collection("seasons");
    this.payments = this.db.collection("payments");
  }
}

process.on("SIGINT", () => {
  process.exit(0);
});
