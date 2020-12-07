const { connect, connection, disconnect, model, Schema } = require("mongoose");
const Mongo =
  process.env.NODE_ENV === "development"
    ? "mongodb://localhost:27017/halloween"
    : "mongodb://root:hustmathskexie@localhost:27017/halloween?authSource=admin";

connect(Mongo, { useNewUrlParser: true, useUnifiedTopology: true });

connection.on("open", () => {
  console.error("open");
});

connection.on("error", (err) => {
  console.error(err);
  disconnect();
});

connection.on("close", (error) => {
  console.log(error);
  connect(Mongo, { useNewUrlParser: true, useUnifiedTopology: true });
});

const schema = new Schema({
  nick: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, minlength: 2 },
  phone: { type: String, minlength: 11 },
  uid: { type: String, match: /^U20[1|2]\d{6}$/ },
  score: { type: Number, default: 0 },
  highest: { type: Number, default: 0 },
  times: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  lastest: { type: Date, required: true },
  create: { type: Date, required: true },
  rank: { type: Number, default: 0 },
});

module.exports = model("user", schema);
