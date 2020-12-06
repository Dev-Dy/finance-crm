const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const QnaSchema = new mongoose.Schema(
    {
        advisor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advisor'
        },
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advisor'
        },
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question'
        },
        question: {
            type: String
        },
        answer: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

QnaSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Qna', QnaSchema)