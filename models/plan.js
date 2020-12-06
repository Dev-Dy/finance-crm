const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        pricing: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

PlanSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Plan', PlanSchema)