const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/todos12", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

conn();
