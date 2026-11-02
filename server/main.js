const express = require('express');
const app = express();
const PORT = 8167;
const path = require('node:path');

var DB = {}

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client")))

app.post("/api/post", function (req, res) {
  if (DB[req.body.item] === undefined) {
    if (parseInt(req.body.amount) < 0) {
      return res.status(500).json({ message: "Cannot have negative amount" })
    }
    DB[req.body.item] = 0
  }
  DB[req.body.item] += parseInt(req.body.amount);
  return res.status(200).json({item: req.body.item, amount:DB[req.body.item]})
})

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
