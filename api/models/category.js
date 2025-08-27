import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    arrApartments: [{
        ref: 'Apartment',
        type: mongoose.Schema.Types.ObjectId
    }]
})
export default mongoose.model('Category', categorySchema)