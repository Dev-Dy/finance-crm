const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ScheduleSchema = new mongoose.Schema(
    {
        advisor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advisor'
        },
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        },
        meet_time: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

ScheduleSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Schedule', ScheduleSchema)