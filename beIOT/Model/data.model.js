const mongoose = require("mongoose");

// const mvsoonSchema = new mongoose.Schema(
//     {
//         title:String,
//         category:String,
//         duration:Number,
//         day:String,
//         thumbnail:String
//     }
// );

// const mvsoon = mongoose.model("mvsoon",mvsoonSchema);

// module.exports = mvsoon;

const dataSchema = new mongoose.Schema(
    {
        stt:Number,
        temperature:Number,
        humidity:Number,
        light:Number,
        windspeed:Number,
        time:String
    }
);

const data = mongoose.model("data",dataSchema);

module.exports = data;

