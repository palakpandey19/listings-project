const user = require("../models/user.js");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");
};
module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new user({ username, email });
        await user.register(newUser, password);
        // for automatic login after signup
        req.login(newUser, (err)=>{
            if(err){
               return next(err);
            }
            req.flash("success", "Welcome to VELORA!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login");
};
module.exports.login = async(req,res,next)=>{
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You have logged out!");
        res.redirect("/listings");
    })
};