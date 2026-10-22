const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Eerror = require("../utils/eerror.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const validateListing = (req, res, next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        console.log(result.error.details.message);
        throw new Eerror(400, result.error.details[0].message);
    }
    else{
        next();
    }
};
router.get("/", wrapAsync(listingController.listingIndex));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/:id", wrapAsync(listingController.showListing));
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
module.exports = router;
