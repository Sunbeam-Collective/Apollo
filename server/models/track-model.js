const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TrackSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    owner: { type: String, required: true }, // username of the owner
  },
  { timestamps: true },
)

module.exports = mongoose.model('Track', TrackSchema)
