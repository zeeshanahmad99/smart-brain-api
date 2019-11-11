const handleProfileId = (req, res, db) => {
  const { id } = req.params;
  db("users")
    .where({ id })
    .select("*")
    .then(userArray => {
      const user = userArray[0];
      user ? res.send(user) : res.status(404).json("user not found");
    })
    .catch(err => res.status(400).json("error getting user"));
};

module.exports = {
  handleProfileId
};
