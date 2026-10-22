const listing = require("./models/listing.js");
const review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!") ;
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;    
    }
    next();
};
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listingg = await listing.findById(id);
    if(!listingg.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission.");
        return res.redirect("/listings");
    }
    next();
};
module.exports.isAuthor = async(req,res,next)=>{
    let {reviewid} = req.params;
    let revieww = await review.findById(reviewid);
    if(!revieww.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission to delete");
        return res.redirect("/listings");
    }
    next();
};