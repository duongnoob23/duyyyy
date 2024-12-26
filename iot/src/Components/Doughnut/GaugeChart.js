import React from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Đăng ký các thành phần của Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ value,color,label1 }) => {
  const data = {
    labels: ["Value", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value], // Giá trị và phần còn lại
        backgroundColor: [`${color}`, "#e0e0e0"], // Màu sắc
        borderWidth: 0, // Loại bỏ viền
      },
    ],
  };


  const options = {
    rotation: -180, // Xoay bắt đầu từ đỉnh
    circumference: 360, // Hiển thị toàn bộ vòng tròn
    cutout: "70%", // Làm rỗng phần giữa
    plugins: {
      tooltip: { enabled: false }, // Tắt tooltip
      legend: { display: false }, // Tắt chú thích
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: 100,
        height: 100,
        margin: "auto",
      }}
    >
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {value} 
        {label1 === "light" ? " Lux" : label1==="temperature" ? " °C" : " %"}
      </div>
    </div>
  );
};

export default GaugeChart;
