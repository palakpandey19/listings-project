const listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_API;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.listingIndex = async(req,res,next)=>{
    const listings = await listing.find({});
    res.render("listings/index", {listings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/createnew");
};
module.exports.showListing = async(req,res,next)=>{
    let {id} = req.params;
    const listingid = await listing.findById(id).populate({path: "reviews", populate:{
        path:"author"
    }}).populate("owner");
    res.render("listings/show", {listingid});
};
module.exports.createListing = async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send();
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};
module.exports.renderEditForm = async(req,res,next)=>{
    let {id} = req.params;
    const listingid = await listing.findById(id);
    res.render("listings/edit", {listingid});
};
module.exports.updateListing = async(req,res,next)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated!");
    res.redirect("/listings");
};
module.exports.destroyListing = async(req,res,next)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};