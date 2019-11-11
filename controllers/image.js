const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage
};
