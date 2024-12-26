import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { URL } from "../Helper/URL";

const LineChartEChartsFix = ({ onDataUpdate }) => {
  const [chartData, setChartData] = useState({
    time: [],
    temperature: [],
    humidity: [],
    light: [],
  });

  const fetchApi = () => {
    fetch(URL + `/windspeed`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data);

          // Lấy dữ liệu từ API
          let indexedData = data.results.map((item, index) => ({
            ...item,
            index: index + 1,
          }));

          // Chia trục Ox thành 10 giá trị
          const step = Math.max(1, Math.floor(indexedData.length / 10));
          const time = indexedData
            .filter((_, index) => index % step === 0)
            .map((item) => item.time);

          const temperature = indexedData.map((item) => item.temperature);
          const humidity = indexedData.map((item) => item.humidity);
          const light = indexedData.map((item) => item.light / 10);
          const windspeed = indexedData.map((item) => item.windspeed );

          // Cập nhật dữ liệu cho biểu đồ
          setChartData({ time, temperature, humidity, light ,windspeed});

          // Gửi dữ liệu mới nhất về component cha
          const option = {
            temperature: temperature[temperature.length - 1],
            humidity: humidity[humidity.length - 1],
            light: light[light.length - 1],
            windspeed: windspeed[windspeed.length - 1],
          };
          onDataUpdate(option);
        }
      });
  };

  useEffect(() => {
    fetchApi();

    // Uncomment để fetch lại dữ liệu mỗi 5 giây
    // const interval = setInterval(() => {
    //   fetchApi();
    // }, 5000);

    // Cleanup interval
    // return () => clearInterval(interval);
  }, []);

  // Cấu hình biểu đồ ECharts
  const option = {
    title: {
      text: "Biểu đồ Nhiệt độ, Độ ẩm, Ánh sáng",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Nhiệt độ (°C)", "Độ ẩm (%)", "Ánh sáng (Lux / 10)"],
      top: "10%",
    },
    xAxis: {
  type: 'category',
  data: chartData.time, // Thời gian hiển thị trên trục Ox
  name: 'Thời gian',
  axisLabel: {
    rotate: 22.5, // Xoay nhãn trục Ox 45 độ (hoặc 90 nếu cần)
    formatter: (value) => value, // Định dạng giá trị nếu cần
  },
},

    yAxis: {
      type: "value",
      name: "Giá trị",
      max: 100, // Giới hạn trục Oy là 100
    },
    series: [
      {
        name: "Tốc độ gió (km/h)",
        type: "line",
        data: chartData.windspeed,
        smooth: true,
        lineStyle: {
          color: "rgba(255, 206, 86, 1)",
        },
      },
    ],
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
  <ReactECharts
    option={option}
    style={{ height: "300px", width: "900px" }} // Đặt chiều rộng cụ thể
  />
</div>
  );
};

export default LineChartEChartsFix;
