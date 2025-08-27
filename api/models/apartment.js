import mongoose from "mongoose";
import advertiser from "./advertiser.js";
import category from "./category.js";
import city from "./city.js";

const apartmentSchema = new mongoose.Schema({
    apartmentName: {
        type: String,
        required: false
    },
    description: {
        type: String
    },
    pic: {
        type: String
    },
    categoryCode: {
        ref: category,
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cityCode: {
        ref: city,
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numBeds: {
        type: Number,
        required: true
    },
    more: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    advertiserCode: {
        ref: advertiser,
        type: mongoose.Schema.Types.ObjectId
    }
})

export default mongoose.model('Apartment', apartmentSchema)