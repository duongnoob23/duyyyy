

import LineChart from '../../Components/LineChart/LineChart';
import './Bai5.css'
import { useState,useEffect } from "react";

import { URL } from '../../Components/Helper/URL';
import LineChartFix from '../../Components/LineChart/LineChartFix';

function Bai5(){    


    // const light1 =document.querySelector("device__light");
    const [turnOn3, setTurnOn3] = useState(JSON.parse(localStorage.getItem('turnOn3')) ? JSON.parse(localStorage.getItem('turnOn3')) : false );
    const [turnOn4, setTurnOn4] = useState(JSON.parse(localStorage.getItem('turnOn4')) ? JSON.parse(localStorage.getItem('turnOn4')) : false );
    
    // const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [dataHome,setDataHome] = useState({
        windspeed:"",
    });
    // const handleDataUpdate = (newData) =>{
    //     setChartData(newData);
    // }
    useEffect(() => {
        localStorage.setItem('turnOn3', JSON.stringify(turnOn3));
        localStorage.setItem('turnOn4', JSON.stringify(turnOn4));
    }, [turnOn]);

    const fetchPostApi = (numberTurnOn,device,turn) =>{
        const option = {
            stt: "",
            device: `${device}`,
            action: `${numberTurnOn === true ? "Off" : "On"}`,
            turn:`${turn}`,
            time: (() => {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            })(),
        };
         fetch(URL+`/putAction`,{
             method:"POST",
             headers:{
                 Accept:"application/json",
                 "Content-type":"application/json"
             },
             body:JSON.stringify(option),
         })
         .then( res => res.json())
         .then(data => {
             if(data){
                console.log(data);
             }
         })
    }


    
    const handleWind = () => {
        setTurnOn(turnOn => !turnOn);
        fetchPostApi(turnOn,"wind","data/wind");
    }

    const handleDataUpdate = (data) =>{
        setDataHome({
            ...dataHome,
            windspeed: data.windspeed,
         });
    }

    const handleTurnOnLight = () => {
        
    }
     return(
        //
        <>
        <div class="main">
            <div className="section">
                <div className="section-two">
                    <div className="bai5">
                        <div className="bai5-item bai5-one" style={{ backgroundImage:`linear-gradient(to bottom, orange ,white ` }}>
                            <div className="bai5-digit" >{dataHome.windspeed} m/s </div>
                            <i className="fa-regular fa-sun"></i>
                            <div className="light">Gió</div>
                        </div>
                    </div>
                    <div className="chart">
                        <div style={{
                            padding: '0px',
                            marginBottom: "20px"
                            }}>
                            <LineChartFix onDataUpdate={handleDataUpdate} />
                        </div>
                    </div>
                    
                    <div className="control">
                        <ul className="control-list ">
                            <li className="electric-item">
                                <div className="electric-box">
                                <input checked={turnOn} type="checkbox" className="electric-input" id="electric-input1" />
                                <label htmlFor="electric-input1" className="electric-label" onClick={handleTurnOnLight}></label>
                                    </div>
                                    
                                
                                <div className="on-off">{turnOn ? "On" : "Off"}</div>
                                <i className={turnOn ? "fa-regular fa-lightbulb electric-light show" : "fa-regular fa-lightbulb electric-light"}></i>
                                <div className="light">Lights</div>
                            </li>  
                            <li className="electric-item">
                                <div className="electric-box">
                                <input checked={turnOn} type="checkbox" className="electric-input" id="electric-input1" />
                                <label htmlFor="electric-input1" className="electric-label" onClick={handleTurnOnLight}></label>
                                    </div>
                                    
                                
                                <div className="on-off">{turnOn ? "On" : "Off"}</div>
                                <i className={turnOn ? "fa-regular fa-lightbulb electric-light show" : "fa-regular fa-lightbulb electric-light"}></i>
                                <div className="light">Lights</div>
                            </li>      
                        </ul>
                    </div>
                </div>
            
            </div>
        </div>
        </>
    )
};
export default Bai5;



