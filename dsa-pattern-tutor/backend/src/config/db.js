const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose v6+ uses the new parser and topology by default. Passing
    // `useNewUrlParser` and `useUnifiedTopology` causes an error with
    // newer Node/mongoose combinations, so pass only the URI and optional
    // mongoose-specific options when needed.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
