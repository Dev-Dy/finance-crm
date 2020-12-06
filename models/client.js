const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ClientSchema = new mongoose.Schema(
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
        fullname: {
            type: String
        },
        phone: {
            type: Number
        },
        email: {
            type: String
        },
        plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
        },
        advisor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advisor'
        },
    },

    {
        versionKey: false,
        timestamps: true
    }
)

ClientSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Client', ClientSchema)