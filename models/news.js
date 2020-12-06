const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsSchema = new mongoose.Schema(
    {
        rank: {
            type: Number
        },
        id:{
            type: String
        },
        title:{
            type: String
        },
        summary:{
            type: String
        },
        url: {
            type: String
        },
        author_name: {
            type: String
        },
        provider_publish_time: {
            type: Number
        },
        provider_name: {
            type: String
        },
        hosted: {
            type: Boolean
        },
        tickers: {
            type: String
        },
        thumbnail: {
            type: String
        },
        featured: {
            type: Boolean
        },
        timeZoneFullName:{
            type: String
        },
        timeZoneShortName: {
            type: String
        },
        gmtOffSetMilliseconds: {
            type: Number
        },
        imageSet: {
            type: String
        }
    },

    {
        versionKey: false,
        timestamps: true
    }

)
NewsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('news', NewsSchema)