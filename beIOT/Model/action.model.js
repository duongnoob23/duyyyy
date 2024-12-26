const mongoose = require("mongoose");


const actionSchema = new mongoose.Schema(
    {
        stt:Number,
        device:String,
        action:String,
        time:String
    }
);

const action = mongoose.model("action",actionSchema);

module.exports = action;

