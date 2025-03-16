const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    tracks: [{ type: ObjectId, ref: 'Track' }],
    created_at: { type: Date, default: Date.now }
  },
  { timestamps: true },
)

module.exports = mongoose.model('Project', ProjectSchema)
