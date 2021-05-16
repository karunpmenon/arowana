const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    creationDate: String,
    customerName: String,
    performanceTitle: String,
    performanceTime: Date,
    ticketPrice: Number,
    theater:String
},{timestamps: true} );

const ticketSchema_model = mongoose.model('ticketCollection',ticketSchema)

module.exports = ticketSchema_model