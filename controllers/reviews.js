const listing = require("../models/listing.js");
const review = require("../models/review.js");
module.exports.createReview = async(req,res,next)=>{
    let {id} = req.params;
    let listingid = await listing.findById(id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    listingid.reviews.push(newreview);
    await newreview.save();
    await listingid.save();
    res.redirect(`/listings/${listingid._id}`);
};
module.exports.destroyReview = async(req,res,next)=>{
    let {id, reviewid} = req.params;
    await listing.findByIdAndUpdate(id, {$pull : {reviews: reviewid}});
    await review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
};