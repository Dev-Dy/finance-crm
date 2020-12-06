const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const AdvisorSchema = new mongoose.Schema(
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
            type: String,
            
        },
        reg_company: {
            type: String,
            
        },
        reg_no: {
            type: Number,
            
        },
        email: {
            type: String,
            
        },
        telephone: {
            type: Number,
            
        },
        fax: {
            type: Number,
            
        },
        language: {
            type: String,
            
        },
        per_address: {
            type: String,
            
        },
        cor_address: {
            type: String,
            
        },
        license_val: {
            type: String,
            
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

AdvisorSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Advisor', AdvisorSchema)