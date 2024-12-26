
const express = require('express');
const app = express();
const port = 3001;
const cors = require("cors");
const dbConnect = require("./Config/database");
const mqtt = require('mqtt');

dbConnect();
app.use(cors());
app.use(express.json());

const dataMGDB = require("./Model/data.model");
const actionDataMGDB = require("./Model/action.model");
// Kết nối đến broker MQTT

const mqttClient = mqtt.connect('mqtt://192.168.137.1:1993', {
  username: 'duy',
  password: 'b21dccn302'
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('newdata', (err) => {
    if (!err) {
      console.log('Subscribed to newdata topic');
    }
  });
});



function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Sử dụng hàm để định dạng thời gian


mqttClient.on('message', async (topic, message) => {
  const data = message.toString();
  console.log(`Received data: ${data}`);

  try {
    const parsedData = JSON.parse(data); // Phân tích chuỗi JSON

    // Tạo đối tượng mới từ model và lưu vào MongoDB
    const count = await dataMGDB.countDocuments({});
    const newData = new dataMGDB({
      stt: count + 1, 
      temperature: parsedData.temperature,
      humidity: parsedData.humidity,
      light: parsedData.light,
      time: formatDate(new Date()) // Sử dụng thời gian đã định dạng
  });

    await newData.save();
    // console.log('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data:', error);
  }
});





app.get('/function',async(req,res) => {
  try{
    
    console.log(req.query);
    const query ={};
    const  sort1 = {};
    const searchKey = req.query.searchKey;
    const searchValue = req.query.searchValue;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1)* limit;   
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    

    if(sortValue === 'asc'){
      sort1[sortKey] = 1;
    }else if(sortValue === 'desc'){
      sort1[sortKey] = -1;
    }

    

    if(searchKey !=="time"  && searchValue){
      query[searchKey]=searchValue;
    }else if (searchKey === 'time' && searchValue) {
      console.log(searchValue);
      // Nếu searchValue có giây
      if (searchValue.length === 19) {
          query[searchKey] = searchValue; // Tìm kiếm chính xác
      } else {
          // Nếu searchValue không có giây, tìm tất cả trong khoảng từ searchValue đến searchValue + 59 giây
          const startTime = `${searchValue}:00`;
          const endTime = `${searchValue}:59`;
          console.log("2");
          console.log(endTime);
          query[searchKey] = {
              $gte: startTime,
              $lte: endTime,
          };
      }
    }

    console.log(query);
    const data = await dataMGDB.find(query).sort(sort1).skip(skip).limit(limit);
    const total1 = await dataMGDB.find(query);
    let totalPages = Math.ceil(total1.length / limit);
    console.log(totalPages);
    if(!data){
      return res.status(400).json("không lấy được data");
    }else{
      return res.json({
        code:200,
        results:data,
        totalPages:totalPages,
      })
    }
  }catch(err){
    return res.status(404).json("Không truy cập vào api đc");
  }
})

app.get('/action',async (req,res) => {
  try{
    const query = ({});
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1)* limit;  
    const searchKey = req.query.searchKey;
    const searchValue = req.query.searchValue;
    
    if(searchKey !=="time"  && searchValue){
      query[searchKey]=searchValue;
    }else if (searchKey === 'time' && searchValue) {
      console.log(searchValue);
      // Nếu searchValue có giây
      if (searchValue.length === 19) {
          query[searchKey] = searchValue; // Tìm kiếm chính xác
      } else {
          // Nếu searchValue không có giây, tìm tất cả trong khoảng từ searchValue đến searchValue + 59 giây
          const startTime = `${searchValue}:00`;
          const endTime = `${searchValue}:59`;
          console.log("2");
          console.log(endTime);
          query[searchKey] = {
              $gte: startTime,
              $lte: endTime,
          };
      }
    }
    const data = await actionDataMGDB.find(query).sort({ time: -1 }).skip(skip).limit(limit);
    const total1 = await actionDataMGDB.find(query);
    const totalPages = Math.ceil(total1.length / limit);

    console.log(totalPages);
    if(!data){
      return res.status(400).json("không lấy được data");
    }else{
      return res.json({
        code:200,
        results:data,
        totalPages:totalPages,
      })
    }

  }catch(err)
  {
    return res.json({
      code:404,
      status:"khong truy cap api duoc"
    })
  }
})

app.post('/putAction', async (req, res) => {
  const option = req.body;
  const message = option.action === "On" ? "ON" : "OFF";
  const mqttResponseTopic = `status/${option.device}`; // Dựa trên thiết bị được điều khiển

  try {
    // Gửi tín hiệu điều khiển
    mqttClient.publish(`data/${option.device}`, message, { qos: 1 });

    // Lắng nghe phản hồi từ ESP8266
    const timeout = 5000; // 5 giây timeout
    const startTime = Date.now();

    mqttClient.on('message', (topic, messageBuffer) => {
      if (topic === mqttResponseTopic) {
        const status = messageBuffer.toString();
        if (
          (option.action === "On" && status === "ON_SUCCESS") ||
          (option.action === "Off" && status === "OFF_SUCCESS")
        ) {
          return res.json({ code: 200, status: `Đèn ${option.device} đã ${option.action}` });
        }
      }
    });

    // Timeout nếu không nhận được phản hồi
    const checkTimeout = setInterval(() => {
      if (Date.now() - startTime > timeout) {
        clearInterval(checkTimeout);
        return res.status(500).json({ code: 500, status: "Không nhận được phản hồi từ ESP8266" });
      }
    }, 100);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ code: 500, status: "Lỗi không xác định" });
  }
});



app.get('/windspeed',async (req,res) => {
  try{
    const data = await dataMGDB.find({}).sort({time : -1 }).limit(10);
    if(!data){
      return res.json({
        code:404,
        status:"khong co data tra ve",
      })
    }else{
      return res.json({
        code:200,
        results:data,
      })
    }
  }catch(err){
    return res.json({
      code:404,
      status:"Khong truy cap duoc api"
    })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
