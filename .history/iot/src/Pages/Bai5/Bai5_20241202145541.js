

import LineChart from '../../Components/LineChart/LineChart';
import './Bai5.css'
import { useState,useEffect } from "react";

import { URL } from '../../Components/Helper/URL';
import LineChartFix from '../../Components/LineChart/LineChartFix';

function Bai5(){    


    // const light1 =document.querySelector("device__light");
    const [turnOn, setTurnOn] = useState(JSON.parse(localStorage.getItem('turnOn')) ? JSON.parse(localStorage.getItem('turnOn')) : false );
    
    // const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [dataHome,setDataHome] = useState({
        windspeed:"",
    });
    // const handleDataUpdate = (newData) =>{
    //     setChartData(newData);
    // }
    useEffect(() => {
        localStorage.setItem('turnOn', JSON.stringify(turnOn));
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

    return(
        //
        <>
        <div class="main">
            <div className="section">
                <div className="section-one">
                    <div className="bai5">
                        <ul className="bai5-list">
                            <li className="bai5-item bai5-one" style={{ backgroundImage:`linear-gradient(to bottom, orange ,white ` }}>
                                <div className="bai5-digit" >{dataHome.windspeed} m/s </div>
                                <i className="fa-regular fa-sun"></i>
                                <div className="light">Gió</div>
                            </li>
                        </ul>
                    </div>
                    <div className="chart">
                    <div style={{ padding: '0px',
                                    marginBottom:"20px" }}>
                                <LineChartFix onDataUpdate={handleDataUpdate} />
                                
                        </div>
                    </div>
                    
                    <div className="control">
                        <ul className="control-list ">
                            <li className="control-item control-wind blink">
                                <div className="on-off">
                                   
                                </div>
                                <i className={turnOn ? "fa-regular fa-lightbulb control-light show" : "fa-regular fa-lightbulb control-light"}></i>
                                <div className="light">Gió</div>
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



