import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

let cached = global.mongoose;

//values illa andre null set madad, ond ee tara obj create agatte
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  //conn iddre adna kalsadu
  if (cached.conn) {
    return cached.conn;
  }

  //promise illa andre start the promise
  if (!cached.promise) {

    const opts={
        bufferCommands:true,
        maxPoolSize:10
    }
    mongoose.connect(MONGODB_URI,opts).then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise=null
    throw error
  }
  return cached.conn;
}
