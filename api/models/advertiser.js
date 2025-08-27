import mongoose from "mongoose";

const advertiserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLenth: 4,
        maxLenth: 16
    },
    phone: {
        type: String,
        required: true,
        minLenth: 9,
        maxLenth: 10
    },
    anotherPhone: {
        type: String,
        required: false,
        minLenth: 9,
        maxLenth: 10
    },
    arrApartments: [{
        ref: 'Apartment',
        type: mongoose.Schema.Types.ObjectId
    }]
})
export default mongoose.model('Advertiser', advertiserSchema)