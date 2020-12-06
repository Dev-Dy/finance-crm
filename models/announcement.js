const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const AnnouncementSchema = new mongoose.Schema(
    {
        advisor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advisor'
        },
        plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
        },
        target_1: {
            type: String,
        },
        target_2: {
            type: String,
        },
        stock: {
            type: String
        },
        entryPoint:{
            type: String
        },
        stopLoss:{
            type: String
        },
        status: {
            type: Boolean
        },
        
        message: {
            type: String,
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

AnnouncementSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Announcement', AnnouncementSchema)