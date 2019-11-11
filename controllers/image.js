const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: "341f81adfefe40ee8bdc040709513d15"
});

const handleClarifaiCall = (req, res) => {
  const {imageUrl} = req.body;
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
  .then(data => res.json(data))
  .catch(err => res.status(400).json('error getting with clarifai'));
}


const handleImage = (db) => (req, res) => {
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
  handleImage,
  handleClarifaiCall
};
