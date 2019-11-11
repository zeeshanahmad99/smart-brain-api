const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "admin",
    database: "smart_brain"
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then(data => res.send(data));
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("*")
    .from("login")
    .where({ email })
    .then(login => {
      const isValid = bcrypt.compareSync(password, login[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then(users => res.json(users[0]))
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        throw Error();
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  db.transaction(trx => {
    trx
      .returning("email")
      .insert({ hash, email })
      .into("login")
      .then(loginEmail => {
        return trx
          .returning("*")
          .insert({ name, email: loginEmail[0], joined: new Date() })
          .into("users")
          .then(users => res.json(users[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db("users")
    .where({ id })
    .select("*")
    .then(userArray => {
      const user = userArray[0];
      user ? res.send(user) : res.status(404).json("user not found");
    })
    .catch(err => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("*")
    .then(users => {
      const user = users[0];
      return user ? res.json(user) : res.status(400).json("user not found");
    })
    .catch(err =>
      res.status(400).json("unable to get entries or user not found")
    );
});

const PORT = process.env.PORT;

app.listen(3000, () => {
  console.log(`server started at port 3000`);
});
