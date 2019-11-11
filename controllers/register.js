const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister
};
