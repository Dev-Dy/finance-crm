const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ChatSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'onModel'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'onModel'
        },
        message: {
            type: String,
            required: true
        }

    },
    {
        versionKey: false,
        timestamps: true
    },
    {
        onModel: {
            type: String,
            required: true,
            enum: ['Advisor', 'Client']
        }
    }

)

ChatSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Chat', ChatSchema)