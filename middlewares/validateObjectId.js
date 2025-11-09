const mongoose = require("mongoose");

function isValidObjectId(req, res, next) {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }
  next();
}

module.exports = isValidObjectId;
