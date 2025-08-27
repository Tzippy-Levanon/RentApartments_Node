import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    cityName: {
        type: String,
        required: true
    },
    arrApartments: [{
        ref: 'Apartment',
        type: mongoose.Schema.Types.ObjectId
    }]
})
export default mongoose.model('City', citySchema)