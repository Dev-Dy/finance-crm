const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const BlogSchema = new mongoose.Schema(
    {
        advisor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advisor'
        },
        content: {
            type: String
        },
        title:{
            type:String
        },
        image:{
            type: String
        },
        isPublish:{
            type: Boolean
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

BlogSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Blog', BlogSchema)