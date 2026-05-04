const mongoose = require('mongoose');
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || typeof mongoUri !== 'string') {
      throw new Error('MONGODB_URI is not configured. Add it to backend/.env.');
    }

    // Mongoose v6+ uses the new parser and topology by default. Passing
    // `useNewUrlParser` and `useUnifiedTopology` causes an error with
    // newer Node/mongoose combinations, so pass only the URI and optional
    // mongoose-specific options when needed.
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
