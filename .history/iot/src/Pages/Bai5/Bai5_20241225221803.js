import "./Bai5.css";
import { useState, useEffect } from "react";

import { URL } from "../../Components/Helper/URL";
import LineChartFix from "../../Components/LineChart/LineChartFix";

function Bai5() {
  // const light1 =document.querySelector("device__light");
  const [turnOn3, setTurnOn3] = useState(
    JSON.parse(localStorage.getItem("turnOn3"))
      ? JSON.parse(localStorage.getItem("turnOn3"))
      : false
  );
  const [turnOn4, setTurnOn4] = useState(
    JSON.parse(localStorage.getItem("turnOn4"))
      ? JSON.parse(localStorage.getItem("turnOn4"))
      : false
  );

  // const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [dataHome, setDataHome] = useState({
    windspeed: "",
  });
  // const handleDataUpdate = (newData) =>{
  //     setChartData(newData);
  // }
  useEffect(() => {
    localStorage.setItem("turnOn3", JSON.stringify(turnOn3));
    localStorage.setItem("turnOn4", JSON.stringify(turnOn4));
  }, [turnOn3, turnOn4]);

  const fetchPostApi = async (numberTurnOn, device, turn) => {
    const option = {
      stt: "",
      device: `${device}`,
      action: numberTurnOn === true ? "Off" : "On",
      turn: `${turn}`,
      time: (() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      })(),
    };

    try {
      const response = await fetch("http://localhost:3001/putAction", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(option),
      });

      if (!response.ok) {
        console.log(">>> lỗi call api putAction");
      }

      // Nếu có phản hồi từ server
      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  // const handleWind = () => {
  //     setTurnOn(turnOn => !turnOn);
  //     fetchPostApi(turnOn,"wind","data/wind");
  // }

  const handleDataUpdate = (data) => {
    setDataHome({
      ...dataHome,
      windspeed: data.windspeed,
    });
  };

  const handleTurnOnCloud = () => {
    setTurnOn3(!turnOn3);
    fetchPostApi(turnOn3, "Cloud", "turn4");
  };

  const handleTurnOnThunder = () => {
    setTurnOn4(!turnOn4);
    fetchPostApi(turnOn4, "Thunder", "turn5");
  };
  return (
    //
    <>
      <div class="main">
        <div className="section">
          <div className="section-two">
            <div className="bai">
              <div className="bai5">
                <div
                  className="bai5-item bai5-one"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, orange ,#ffc355 `,
                  }}
                >
                  <div className="bai5-digit">{dataHome.windspeed} m/s </div>
                  <i className="fa-regular fa-sun"></i>
                  <div className="windspeed">Gió</div>
                </div>
              </div>
            </div>
            <div className="chart">
              <div
                style={{
                  padding: "0px",
                  marginBottom: "20px",
                }}
              >
                <LineChartFix onDataUpdate={handleDataUpdate} />
              </div>
            </div>

            <div className="control">
              <ul className="control-list ">
                <li className="control-item">
                  <div className="control-box">
                    <input
                      checked={turnOn3}
                      type="checkbox"
                      className="control-input"
                      id="control-input1"
                    />
                    <label
                      htmlFor="control-input1"
                      className="control-label"
                      onClick={handleTurnOnCloud}
                    ></label>
                  </div>

                  <div className="on-off">{turnOn3 ? "On" : "Off"}</div>
                  <i
                    className={
                      turnOn3
                        ? "fa-solid fa-cloud control-cloud show"
                        : "fa-solid fa-cloud control-cloud"
                    }
                  ></i>
                  <div className="text">Cloud</div>
                </li>
                <li className="control-item">
                  <div className="control-box">
                    <input
                      checked={turnOn4}
                      type="checkbox"
                      className="control-input"
                      id="control-input1"
                    />
                    <label
                      htmlFor="control-input1"
                      className="control-label"
                      onClick={handleTurnOnThunder}
                    ></label>
                  </div>

                  <div className="on-off">{turnOn4 ? "On" : "Off"}</div>
                  <i
                    className={
                      turnOn4
                        ? "fa-solid fa-bolt control-thunder show"
                        : "fa-solid fa-bolt control-thunder"
                    }
                  ></i>
                  <div className="text">Thunder</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Bai5;