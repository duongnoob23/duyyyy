const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const dbConnect = require("./Config/database");
const mqtt = require("mqtt");

dbConnect();
app.use(cors());
app.use(express.json());

const dataMGDB = require("./Model/data.model");
const actionDataMGDB = require("./Model/action.model");
// Kết nối đến broker MQTT
const ip = "192.168.88.142:1996";
const usernameMQTT = "tienduong";
const passwordMQTT = "b21dcnn590";
const mqttClient = mqtt.connect(`mqtt://${ip}`, {
  username: usernameMQTT,
  password: passwordMQTT,
});

// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe('newdata', (err) => {
//     if (!err) {
//       console.log('Subscribed to newdata topic');
//     }
//   });
// });

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe vào các topic
  mqttClient.subscribe(
    ["newdata", "light", "temperature", "air", "cloud", "thunder"],
    (err) => {
      if (!err) {
        console.log(
          "Subscribed to newdata, turn1,turn2,turn3,turn4,turn5 topics"
        );
      } else {
        console.error("Error subscribing to topics:", err);
      }
    }
  );
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Sử dụng hàm để định dạng thời gian

mqttClient.on("message", async (topic, message) => {
  const data = message.toString();
  // console.log(`Received data: ${data}`);

  if (topic === "newdata") {
    try {
      const parsedData = JSON.parse(data); // Phân tích chuỗi JSON

      // Tạo đối tượng mới từ model và lưu vào MongoDB
      const count = await dataMGDB.countDocuments({});
      const newData = new dataMGDB({
        stt: count + 1,
        temperature: parsedData.temperature,
        humidity: parsedData.humidity,
        light: parsedData.light,
        time: formatDate(new Date()), // Sử dụng thời gian đã định dạng
      });

      await newData.save();
      // console.log('Data saved to MongoDB');
    } catch (error) {
      console.error("Error saving data:", error);
    }
  } else if (topic === "light") {
    console.log(" >>>>>> đã nhận được topic light");
  } else if (topic === "temperature") {
    console.log(" >>>>> đã nhận được topic temperature");
  } else if (topic === "air") {
    console.log(" >>>>> đã nhận được topic air");
  } else if (topic === "cloud") {
    console.log(" >>>>> đã nhận được topic cloud");
  } else if (topic === "thunder") {
    console.log(" >>>>> đã nhận được topic thunder");
  }
});

let status = null;

app.get("/checkTurn", async (req, res) => {
  try {
    if (status !== null) {
      res.json(status);
      status = null;
    } else {
      res.json({
        code: 404,
        status: "chưa nhận được trạng thái cuối cùngcùng",
      });
    }
  } catch (err) {
    return res.json({
      code: 404,
      status: "không truy cập được api kiểm tra trạng tháithái",
    });
  }
});

app.get("/function", async (req, res) => {
  try {
    // console.log(req.query);

    const query = {};
    const sort1 = {};
    const searchKey = req.query.searchKey;
    const searchValue = req.query.searchValue;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    if (sortValue === "asc") {
      sort1[sortKey] = 1;
    } else if (sortValue === "desc") {
      sort1[sortKey] = -1;
    }

    if (searchKey !== "time" && searchValue) {
      query[searchKey] = searchValue;
    } else if (searchKey === "time" && searchValue) {
      // console.log(searchValue);
      // Nếu searchValue có giây
      if (searchValue.length === 19) {
        query[searchKey] = searchValue; // Tìm kiếm chính xác
      } else {
        // Nếu searchValue không có giây, tìm tất cả trong khoảng từ searchValue đến searchValue + 59 giây
        const startTime = `${searchValue}:00`;
        const endTime = `${searchValue}:59`;
        // console.log("2");
        // console.log(endTime);
        query[searchKey] = {
          $gte: startTime,
          $lte: endTime,
        };
      }
    }

    // console.log(query);
    const data = await dataMGDB.find(query).sort(sort1).skip(skip).limit(limit);
    const total1 = await dataMGDB.find(query);
    let totalPages = Math.ceil(total1.length / limit);
    // console.log(totalPages);
    if (!data) {
      return res.status(400).json("không lấy được data");
    } else {
      return res.json({
        code: 200,
        results: data,
        totalPages: totalPages,
      });
    }
  } catch (err) {
    return res.status(404).json("Không truy cập vào api đc");
  }
});

app.get("/action", async (req, res) => {
  try {
    const query = {};
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const searchKey = req.query.searchKey;
    const searchValue = req.query.searchValue;

    if (searchKey !== "time" && searchValue) {
      query[searchKey] = searchValue;
    } else if (searchKey === "time" && searchValue) {
      // console.log(searchValue);
      // Nếu searchValue có giây
      if (searchValue.length === 19) {
        query[searchKey] = searchValue; // Tìm kiếm chính xác
      } else {
        // Nếu searchValue không có giây, tìm tất cả trong khoảng từ searchValue đến searchValue + 59 giây
        const startTime = `${searchValue}:00`;
        const endTime = `${searchValue}:59`;
        // console.log("2");
        // console.log(endTime);
        query[searchKey] = {
          $gte: startTime,
          $lte: endTime,
        };
      }
    }
    const data = await actionDataMGDB
      .find(query)
      .sort({ time: -1 })
      .skip(skip)
      .limit(limit);
    const total1 = await actionDataMGDB.find(query);
    const totalPages = Math.ceil(total1.length / limit);

    // console.log(totalPages);
    if (!data) {
      return res.status(400).json("không lấy được data");
    } else {
      return res.json({
        code: 200,
        results: data,
        totalPages: totalPages,
      });
    }
  } catch (err) {
    return res.json({
      code: 404,
      status: "khong truy cap api duoc",
    });
  }
});

app.post("/putAction", async (req, res) => {
  const option = req.body;
  const mqttResponseTopic = `status/${option.device}`; // Dựa trên thiết bị được điều khiển
  console.log(option);
  try {
    const count = await actionDataMGDB.countDocuments({});
    const newActionData = new actionDataMGDB({
      stt: count + 1,
      device: option.device,
      action: option.action,
      time: option.time,
    });

    await newActionData.save();
    // Gửi tín hiệu điều khiển
    const message = option.action === "On" ? "on" : "off"; // Chọn nội dung tin nhắn tùy theo action
    mqttClient.publish(`${option.turn}`, message, { qos: 1 }, (error) => {
      if (error) {
        console.error("Lỗi khi gửi pub tới mqtt", error);
      } else {
        console.log("Đã gửi pub tới mqtt", message);
      }
    });

    return res.json({
      code: 200,
      status: "Đã lưu data action vào csdl ",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "Lỗi không xác định putAction",
    });
  }
});

app.get("/windspeed", async (req, res) => {
  try {
    const data = await dataMGDB.find({}).sort({ time: -1 }).limit(10);
    if (!data) {
      return res.json({
        code: 404,
        status: "khong co data tra ve",
      });
    } else {
      return res.json({
        code: 200,
        results: data,
      });
    }
  } catch (err) {
    return res.json({
      code: 404,
      status: "Khong truy cap duoc api",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
