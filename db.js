const mongoose = require('mongoose');


async function connect() {
  const dbUri = "mongodb://localhost:27017/online-test";

  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connect;