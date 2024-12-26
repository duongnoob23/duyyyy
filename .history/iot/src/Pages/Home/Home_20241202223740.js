

import '../Home/Home.css';
import { useState,useEffect } from "react";

import { URL } from '../../Components/Helper/URL';
import GaugeChart from '../../Components/Doughnut/GaugeChart';
import LineChartECharts from '../../Components/LineChart/LineChartECharts';

function Home(){    


    // const light1 =document.querySelector("device__light");
    const [turnOn, setTurnOn] = useState(JSON.parse(localStorage.getItem('turnOn')) ? JSON.parse(localStorage.getItem('turnOn')) : false );
    const [turnOn1, setTurnOn1] = useState(JSON.parse(localStorage.getItem('turnOn1')) ? JSON.parse(localStorage.getItem('turnOn1')) : false );
    const [turnOn2, setTurnOn2] = useState(JSON.parse(localStorage.getItem('turnOn2')) ? JSON.parse(localStorage.getItem('turnOn2')) : false );
    // const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [dataHome,setDataHome] = useState({
        temperature:"",
        humidity:"",
        light:"",
    });
    // const handleDataUpdate = (newData) =>{
    //     setChartData(newData);
    // }
    useEffect(() => {
        localStorage.setItem('turnOn', JSON.stringify(turnOn));
        localStorage.setItem('turnOn1', JSON.stringify(turnOn1));
        localStorage.setItem('turnOn2', JSON.stringify(turnOn2));
    }, [turnOn2,turnOn1,turnOn]);

    const fetchPostApi = async (numberTurnOn, device, turn) => {
        const option = {
          stt: "",
          device: `${device}`,
          action: numberTurnOn === true ? "Off" : "On",
          turn: `${turn}`,
          time: (() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          })(),
        };
      
        try {
          const response = await fetch(URL + `/putAction`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify(option),
          });
      
          const data = await response.json();
      
          if (response.ok && data.code === 200) {
            console.log("Đèn LED đã cập nhật thành công!");
            console.log(data);
            // Cập nhật giao diện tại đây, sau khi server phản hồi thành công
            if (option.action === "On") {
              console.log("Đèn đã bật!");
              // Gọi hàm hoặc cập nhật state để hiển thị trạng thái "On"
            } else if (option.action === "Off") {
              console.log("Đèn đã tắt!");
              // Gọi hàm hoặc cập nhật state để hiển thị trạng thái "Off"
            }
          } else {
            console.error("Lỗi từ server:", data.status);
            alert("Không thể cập nhật trạng thái đèn. Vui lòng thử lại!");
          }
        } catch (error) {
          console.error("Lỗi khi gửi yêu cầu đến server:", error);
          alert("Đã xảy ra lỗi kết nối. Vui lòng kiểm tra mạng!");
        }
      };

    // useEffect(() => {
    //     fetch('http://localhost:3001/load')
    //     .then(res => res.json())
    //     .then(data => {
    //         if(data){
    //             console.log(data.results);
    //         }
    //     })
    // },[])
    const handleTurnOnLight = () => {
        // const light =document.querySelector(".electric1-light");
        // light.classList.toggle("show");
        setTurnOn(turnOn => !turnOn);
        // fetchPostApi(turnOn,"light","data/light");
    }
    const handleTurnOnTemperature = () => {
        setTurnOn1(turnOn1 => !turnOn1);
        fetchPostApi(turnOn1,"temperature","data/light2");
    }
    const handleTurnOnAir = () => {
        setTurnOn2(turnOn2 => !turnOn2);
        fetchPostApi(turnOn2,"air","data/light3");
    }

    const handleDataUpdate = (data) =>{
        setDataHome({
            ...dataHome,
            temperature:data.temperature,
            humidity:data.humidity,
            light:parseInt(data.light),
         });
    }

    // console.log(dataHome.light);
   


    return(
        //
        <>
    <div class="main">
    <div className="section">
        <div className="section-one">
            <div className="left">
            <div className="sensor">
          <ul className="sensor-list">
            <li className="sensor-item light">
              <GaugeChart value={dataHome.light} color={"#ffb74d"} label1={ "light"} />
                    <div className="label">Light
                      <i className="fa-regular fa-sun"></i>
                    </div>
            </li>
            <li className="sensor-item temperature">
              <GaugeChart value={dataHome.temperature} color={"#ef5350"} label1={"temperature"} />
                    <div className="label">Temperature
                    <i className="fa-solid fa-temperature-three-quarters"></i>
                    </div>
            </li>
            <li className="sensor-item humidity">
              
              <GaugeChart value={dataHome.humidity} color={"#42a5f5"} label1={ "humidity"}/>
                    <div className="label">Humidity
                      <i className="fa-solid fa-wind"></i>
                    </div>
          </li>
            </ul>
        </div>
        <div className="chart" style={{margin:"10px",height:"70%"}}>
            <div className= "styleChart" >
                  {/* <LineChart onDataUpdate={handleDataUpdate} /> */}
                  <LineChartECharts onDataUpdate={handleDataUpdate} />
            </div>
        </div>    
            </div>
        <div className="right">
             <div className="electric1">
          </div>  
              <ul className="electric1-list">
                <li className="electric1-item">
                  <div className="electric1-box">
                  <input checked={turnOn} type="checkbox" className="electric1-input" id="electric1-input1" />
                  <label htmlFor="electric1-input1" className="electric1-label" onClick={handleTurnOnLight}></label>
                      </div>
                      
                  
                  <div className="on-off">{turnOn ? "On" : "Off"}</div>
                  <i className={turnOn ? "fa-regular fa-lightbulb electric1-light show" : "fa-regular fa-lightbulb electric1-light"}></i>
                  <div className="light">Lights</div>
              </li>
              <li className="electric1-item">
                  <div className="electric1-box">
                  <input checked={turnOn1} type="checkbox" className="electric1-input" id="electric1-input2" />
                  <label htmlFor="electric1-input2" className="electric1-label" onClick={handleTurnOnTemperature}></label>
                  </div>
                  <div className="on-off">{turnOn1 ? "On" : "Off"}</div>
                  <i className={turnOn1 ? "fa-solid fa-temperature-three-quarters electric1-temperature show" : "fa-solid fa-temperature-three-quarters electric1-temperature"}></i>
                  <div className="temperature">Temperature</div>
              </li>
              <li className="electric1-item">
                  <div className="electric1-box">
                  <input checked={turnOn2} type="checkbox" className="electric1-input" id="electric1-input3" />
                  <label htmlFor="electric1-input3" className="electric1-label" onClick={handleTurnOnAir}></label>
                  </div>
                  <div className="on-off">{turnOn2 ? "On" : "Off"}</div>
                  <i className={turnOn2 ? "fa-solid fa-fan electric1-air show" : "fa-solid fa-fan electric1-air"}></i>
                  <div className="air-conditioner">Air conditioner</div>
              </li>
              </ul>
            </div>
          </div>
       
        </div>
    </div>

        </>
    )
};
export default Home;



