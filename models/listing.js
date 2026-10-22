const mongoose = require("mongoose");
const review = require("./review.js");

const listSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : String,
    image: {
        filename: {
            type: String,
            default: "default.jpg"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    : v
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
    geometry: {
        type: {
        type: String, 
        enum: ['Point'], 
        required: true
        },
        coordinates: {
        type: [Number], 
        required: true
        }
    }
});
listSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
        await review.deleteMany({_id: {$in : listing.reviews}});
    }
});
const listing = mongoose.model("listing", listSchema);
module.exports = listing;