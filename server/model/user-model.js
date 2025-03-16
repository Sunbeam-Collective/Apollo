const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        own_tracks: [{ type: ObjectId, ref: 'Track' }],
        saved_tracks: [{ type: ObjectId, ref: 'Track' }],
        projects: [{ type: ObjectId, ref: 'Project' }],
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
