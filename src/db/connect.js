const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    // init GridFS stream
    global.gfs = Grid(mongoose.connection.db, mongoose.mongo);
    global.gfs.collection("uploads");

    // init GridFS Bucket
    global.gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    console.log(`🟢 [database] DB connected in ${process.env.NODE_ENV} mode`);
  })
  .catch((err) =>
    console.log(`🔴 DB connection faild in ${process.env.NODE_ENV} mode\n`, err)
  );

// var db = mongoose.connection;

// db.on(
//   "error",
//   console.error.bind(
//     console,
//     `DB connection faild in ${process.env.NODE_ENV} mode\n`
//   )
// );

// db.once("open", () => {
//   // init GridFS stream
//   global.gfs = Grid(mongoose.connection.db, mongoose.mongo);
//   global.gfs.collection("uploads");

//   // init GridFS Bucket
//   global.gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: "uploads",
//   });

//   console.log(`[database] DB connected in ${process.env.NODE_ENV} mode`);
// });
