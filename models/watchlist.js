const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const WatchlistSchema = new mongoose.Schema(
    {
        stock: {
            type: String
        },
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        },

    },

    {
        versionKey: false,
        timestamps: true
    }

)
WatchlistSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Watchlist', WatchlistSchema)