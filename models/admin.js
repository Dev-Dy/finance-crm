const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const AdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

AdminSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Admin', AdminSchema)