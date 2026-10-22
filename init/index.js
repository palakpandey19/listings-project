const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/travel");
}
main().then(()=>{
    console.log("connection of mongoose to the node js is done.");
})
.catch((err)=>{
    console.log("error occured:", err);
});
const initDb = async() =>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, owner: "6acb398b66e1901412ea9efb"
    }));
    await listing.insertMany(initData.data);
    console.log("all data was entered.");
};
initDb();