const handleSignIn = (req, res, db, bcrypt) => {
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
  }

  module.exports = {
      handleSignIn
  }