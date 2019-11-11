const handleRoot = (req, res) => {
  db.select("*")
    .from("users")
    .then(data => res.send(data));
};

module.exports = {
  handleRoot
};
