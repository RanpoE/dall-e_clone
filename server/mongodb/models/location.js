import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
    timestamp: Date
  });
  
  const LocationModel = mongoose.model('Location', LocationSchema);
  
  export default LocationModel