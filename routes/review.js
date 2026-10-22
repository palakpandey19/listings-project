const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Eerror = require("../utils/eerror.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const validateReview = (req, res, next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
        console.log(result.error.details.message);
        throw new Eerror(400, result.error.details[0].message);
    }
    else{
        next();
    }
};
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
router.delete("/:reviewid", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));
module.exports = router;
