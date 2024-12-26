import './DataLogs.css';
import { useState,useEffect,useRef } from 'react';
import { URL } from '../../Components/Helper/URL';

function DataLogs(){
    
    
    // const [dataLog,setDataLog] = useState([]);
    const [data,setData] = useState([]);      // data in ra trong bảng
    const [selectKey,setSelectKey] = useState('');      // giá trị người dùng chọn 
    const [selectInput,setSelectInput] = useState("");  // giá trị của ô input
    const [selectRow,setSelectRow] = useState(10);
    const [totalPage,setTotalPage] = useState(0);
    console.log(data);
    const inputRef = useRef(null);                      // input nhập giá trị
    const [params,setParams] = useState({
        searchKey:"",
        searchValue:"",
        page:1,
        limit:10,
        sortKey:"",
        sortValue:"",
    })
    const [api,setApi] = useState(URL+`/function?searchKey=${params.searchKey}&searchValue=${params.searchValue}&page=${params.page}&limit=${params.limit}`);

 
    const fetchApi = (link) =>{
        fetch(link)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            setData(data.results);
            // setDataBackUp(data.results);
            data.totalPages && setTotalPage(data.totalPages);
        });
    } 
// ?page=${params.page}&limit=${params.limit}
    useEffect(()=>{
        fetchApi(api);
    },[]);
    
    // const interval = setInterval( () =>{
    // }, 1000);
    // return () => clearInterval(interval);
// mình đang muốn là 1 đường dẫn sử dụng chung cho toàn bộ các yêu cầu
    
    const handleChangeSelectKey = (e) =>{
        console.log(e.target.value);
        setSelectKey(e.target.value); // lưu lựa chọn đơn vị 
    }
    const handleChangeSelectInput = (e) =>{
        console.log(e.target.value);
      
        setSelectInput(e.target.value) // lưu giá trị ô input search vào 
    }
    const handleChangeSelectRow = (e)=>{
        console.log(e.target.value);
        setSelectRow(e.target.value);
        setParams({
            ...params,
            limit:e.target.value,
        });
    }
    const handleNextPage = (e) =>{
        setParams({
            ...params,
            page:params.page + 1,
        });
    }
    const handlePrePage = (e) =>{
        setParams({
            ...params,
            page:params.page - 1,
        });
    }
    const handleClickSearch =(e) =>{
        // console.log("click");
        if(!selectKey || !selectInput){
            setParams({
                ...params,
                searchKey:"",
                searchValue:"",
                page:1,
                limit:10,
                sortKey:"",
                sortValue:"",
                startTime:"",
                endTime:"",
            });
            
        }
        // console.log("search");
        if(selectKey !== ""){
            setParams({
                ...params,
                searchKey:selectKey,
                searchValue:selectInput,
                page:1,
            });
            inputRef.current.value="";
            inputRef.current.focus();
            setSelectInput("");
            setSelectKey("");
            // console.log("1");
        }

        // if(selectKey === "time"){
        //     // console.log("1");
        //     setParams({
        //         ...params,
        //         startTime:start,
        //         endTime:end,
        //         page:1,
        //     });
        //     setSelectInput("");
        //     setSelectKey("");
        //     inputRef1.current.value="";
        //     inputRef2.current.value="";
        // }
    }
    
    const handleClickSort = (sortKey) =>{
       let sortValue = 'asc';
       
        if(params.sortKey === sortKey && params.sortValue==='asc'){
            sortValue='desc';
        }else if(params.sortKey === sortKey && params.sortValue ==='desc'){
            sortValue="";
            sortKey="";
        }


       setParams({
        ...params,
        sortKey:sortKey,
        sortValue:sortValue,
        page:1,
        });


    }

    useEffect(() => {
        // console.log(params);
        // console.log("3");
        if ( (params.searchKey && params.searchValue) || params.limit || params.page || params.sortValue || (params.startTime && params.endTime)) {
            // console.log("4");
            // console.log(params.searchKey);
            // console.log(params.searchValue);
            console.log(api);
            fetch(api)
            .then(res => res.json())
            .then(data1 => {
                if(data1){
                    console.log(data1);
                    setData(data1.results);
                    setTotalPage(data1.totalPages);
                }
            });
        }

    },[api]);
    

    useEffect(()=>{
        // console.log("2");
        setApi(URL+`/function?searchKey=${params.searchKey}&searchValue=${params.searchValue}&page=${params.page}&limit=${params.limit}&sortKey=${params.sortKey}&sortValue=${params.sortValue}`);
    },[params]);
// &sortKey=${params.sortKey}&sortValue=${params.sortValue}
    
    return(
        <>
            <div className='action'>
                <h2 className="action-title" >
                   DataLog
                </h2>
                <div className="option">
                    <div className="search">
                        <input ref={inputRef} type="text" placeholder="search" className="search__input" onChange={handleChangeSelectInput}></input>
                        <i class="fa-solid fa-magnifying-glass search__icon" onClick={handleClickSearch} ></i>
                    </div>
                    <div className="select">
                        <select value ={selectKey} className="select__list" onChange={handleChangeSelectKey} >
                            <option  className="select__option1" value={'temperature'}>Temperature</option>
                            <option  className="select__option2" value={'humidity'}>Humidity</option>
                            <option className="select__option3" value={'light'}>Light</option>
                            <option className="select__option4" value={'time'}>Time</option>
                            
                            <option className="select__option6" value="" hidden>--Hãy chọn giá trị--</option>
                        </select>
                    </div>
                    <div className="select2">
                        <select value ={selectRow} className="select__list" onChange={handleChangeSelectRow}  >
                            <option  className="select2__option1" value={10}>10 hàng</option>
                            <option  className="select2__option2" value={20}>20 hàng</option>
                            <option className="select2__option3" value={30}>30 hàng</option>
                            <option className="select2__option4" value="" hidden>--Hãy chọn giá trị--</option>
                        </select>
                    </div>
                </div>

                <div className='table__container'>
                    <table className="table">
                        <thead className = "table__head">
                            <tr className="table-row__head">
                                <th classname="table__id table-row__item" onClick={() => handleClickSort("id")}>ID</th>
                                <th className="table__temperature table-row__item" onClick={() => handleClickSort("temperature")}>Nhiệt độ (°C)</th>
                                <th className="table__humidity table-row__item" onClick={() => handleClickSort("humidity")}>Độ ẩm (%)</th>
                                <th className="table__light table-row__item" onClick={() => handleClickSort("light")}>Ánh sáng (lux)</th>
                                {/* <th className="table__time table-row__item" onClick={() => handleClickSort("windspeed")}>Tốc độ gió</th> */}
                                <th className="table__time table-row__item" onClick={() => handleClickSort("time")}>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {data && data.map((item) => (
                                <tr className="table-row__body" key={item._id}>
                                    <td>{item.stt}</td>
                                    <td>{item.temperature}</td>
                                    <td>{item.humidity}</td>
                                    <td>{item.light}</td>
                                    {/* <td>{item.windspeed}</td> */}
                                    <td>{item.time}</td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='pagination'>
                    <ul className='pagi__list'>
                        <li className='pagi__pre pagi__item' onClick={handlePrePage}>
                        {totalPage === 1 ? "" : 
                            <>
                                { params.page === 1 ? "" : 
                                <>
                                <i class="fa-solid fa-backward"></i>
                                </>
                                }
                            </>
                            }
                        </li>
                        <li className='pagi__cur pagi__item'>{params.page}</li>
                        <li className='pagi__next pagi__item' onClick={handleNextPage}>
                            {totalPage === 1  ? "" : 
                            <>
                                { params.page === totalPage ? "" : 
                                <>
                                <i class="fa-solid fa-forward"></i>
                                </>
                                }
                            </>
                            }
                            
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
};

export default DataLogs;