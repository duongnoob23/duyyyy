const dbConnect = require("../Config/database");
const actionData = require("../DBload/action.data");
const actionDataMD = require("../Model/action.model");

const dbLoad = async () =>{
    dbConnect();
    for(var item of actionData){
        try{
            const m = new actionDataMD({
                stt:item?.stt,
                device:item?.device,
                action:item?.action,
                time:item?.time,
            })

            await m.save();
        }catch(err){
            console.log(err);
            console.log("không đẩy được data lên mongoDB");
        }
    }
}

dbLoad()