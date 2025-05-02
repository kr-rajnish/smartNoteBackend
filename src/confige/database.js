const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Rajnish_kumar:QnCvQvTuacrqGl8Z@namastenode.pvn3m.mongodb.net/smartNotes"
  );
};

module.exports = connectDB;
