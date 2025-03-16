const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TrackSchema = new Schema(
  {
    uid: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    link: { type: String, required: true}, // link to 0x0.st api
    secret_token: { type: String, required: true }, // this is for deleting the track. only the owner should be able to use this
    owner: { type: String, required: true }, // username of the owner
  },
  { timestamps: true },
)

module.exports = mongoose.model('Track', TrackSchema)
