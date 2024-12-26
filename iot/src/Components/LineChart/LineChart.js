import React, { useEffect,useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {URL} from '../Helper/URL';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const LineChart = ({onDataUpdate}) => {


  const [dataChart,setDataChart] = useState({
    labels:[],
    datasets:[],
  })
  // console.log(onDataUpdate);
  const fetchApi = () => {
    fetch(URL + `/windspeed`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          console.log(data);
  
          // Adding index (increasing order) to the data
          let indexedData = data.results.map((item, index) => ({
            ...item, 
            index: index + 1 // Adding index starting from 1
          }));
  
          // Extract time, temperature, humidity, and light values
          let time = indexedData.map(item => item.time);
          let temperature = indexedData.map(item => item.temperature);
          let humidity = indexedData.map(item => item.humidity);
          let light = indexedData.map(item => item.light / 10);
  
          setDataChart({
            labels: time,
            datasets: [
              {
                label: 'Nhiệt độ (°C)',
                data: temperature,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
              },
              {
                label: 'Độ ẩm (%)',
                data: humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
              },
              {
                label: 'Ánh sáng (Lux / 10)',
                data: light,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
              },
            ],
          });
  
          const option = {
            temperature: temperature[temperature.length - 1], // Lấy giá trị mới nhất
            humidity: humidity[humidity.length - 1], // Lấy giá trị mới nhất
            light: light[light.length - 1], // Lấy giá trị mới nhất
          };
  
          onDataUpdate(option);
        }
      });
  };

  useEffect(() => {
    fetchApi(); // Lần gọi đầu tiên ngay khi component mount

    // const interval = setInterval(() => {
    //   fetchApi(); // Gọi API mỗi 5 giây (5000ms)
    // }, 5000);

    // return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);


  const options = {
  responsive: true,
  maintainAspectRatio: true, // Bật giữ tỷ lệ
  aspectRatio: 2.5, // Giảm tỷ lệ chiều cao (giá trị mặc định là 2)
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Biểu đồ Nhiệt độ, Độ ẩm, Ánh sáng',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100, // Đặt giá trị tối đa cho trục y
    },
  },
};

  

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <Line data={dataChart} options={options}  />
    </div>
  );
};

// onDataUpdate={handleDataUpdate}
export default LineChart;


