const mongoose = require('mongoose');
const config = require('config'); //config allows us to set global variables mongoURI here used as below
const db = config.get('mongoURI');

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    console.log('Mongodb connected')
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1)
  }
};

module.exports = connectDb;