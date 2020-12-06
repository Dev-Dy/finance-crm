const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const QuoteSchema = new mongoose.Schema(
    {
        language:{
            type: String
        },
        quoteType:{
            type: String
        }, 
        quoteSourceName:{
            type: String
        }, 
        triggerable:{
            type: String
        }, 
        currency:{
            type: String
        }, 
        exchange:{
            type: String
        }, 
        shortName:{
            type: String
        }, 
        longName:{
            type: String
        }, 
        messageBoardId:{
            type: String
        }, 
        exchangeTimezoneName:{
            type: String
        }, 
        exchangeTimezoneShortName:{
            type: String
        }, 
        gmtOffSetMilliseconds:{
            type: Number
        }, 
        firstTradeDateMilliseconds:{
            type: Number
        }, 
        priceHint:{
            type: Number
        }, 
        regularMarketChange:{
            type: Number
        }, 
        regularMarketChangePercent:{
            type: Number
        }, 
        regularMarketTime:{
            type: Number
        }, 
        regularMarketPrice:{
            type: Number
        }, 
        regularMarketDayHigh:{
            type: Number
        }, 
        regularMarketDayRange:{
            type: Number
        }, 
        regularMarketDayLow:{
            type: Number
        }, 
        regularMarketVolume:{
            type: Number
        }, 
        bid:{
            type: Number
        }, 
        ask:{
            type: Number
        }, 
        askSize:{
            type: Number
        }, 
        fullExchangeName:{
            type: String
        }, 
        financialCurrency:{
            type: String
        }, 
        regularMarketOpen:{
            type: Number
        }, 
        averageDailyVolume3Month:{
            type: Number
        }, 
        averageDailyVolume10Day:{
            type: Number
        }, 
        fiftyTwoWeekRange:{
            type: Number
        }, 
        fiftyTwoWeekHighChange:{
            type: Number
        }, 
        fiftyTwoWeekHighChangePercent:{
            type: Number
        }, 
        fiftyTwoWeekLow:{
            type: Number
        }, 
        fiftyTwoWeekHigh:{
            type: Number
        }, 
        earningsTimestamp:{
            type: Number
        }, 
        earningsTimestampStart:{
            type: Number
        }, 
        earningsTimestampEnd:{
            type: Number
        }, 
        trailingAnnualDividendRate:{
            type: Number
        }, 
        trailingPE:{
            type: Number
        }, 
        trailingAnnualDividendYield:{
            type: Number
        }, 
        epsForward:{
            type: Number
        }, 
        marketState:{
            type: String
        }, 
        sharesOutstanding:{
            type: Number
        }, 
        bookValue:{
            type: Number
        }, 
        fiftyDayAverage:{
            type: Number
        }, 
        fiftyDayAverageChange:{
            type: Number
        }, 
        fiftyDayAverageChangePercent:{
            type: Number
        }, 
        twoHundredDayAverage:{
            type: Number
        }, 
        twoHundredDayAverageChange:{
            type: Number
        }, 
        twoHundredDayAverageChangePercent:{
            type: Number
        }, 
        marketCap:{
            type: Number
        }, 
        forwardPE:{
            type: Number
        }, 
        priceToBook:{
            type: Number
        }, 
        sourceInterval:{
            type: Number
        }, 
        exchangeDataDelayedBy:{
            type: Number
        }, 
        tradeable:{
            type: Boolean
        }, 
        market:{
            type: String
        }, 
        esgPopulated:{
            type: Boolean
        }, 
        symbol:{
            type: String
        }
    }, 
        
    {
        versionKey: false,
        timestamps: true
    }

)


QuoteSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('quote', QuoteSchema)