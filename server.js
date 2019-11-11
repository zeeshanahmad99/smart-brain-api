const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require('./controllers/register');
const signIn = require('./controllers/sign-in');
const profileId = require('./controllers/profile-id');
const image = require('./controllers/image');
const root = require('./controllers/root');

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", root.handleRoot);

app.post("/signin", signIn.handleSignIn(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profileId.handleProfileId(db));

app.put("/image", image.handleImage(db));

app.post('/clarifai', image.handleClarifaiCall);

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`server started at port ${PORT}`);
});
