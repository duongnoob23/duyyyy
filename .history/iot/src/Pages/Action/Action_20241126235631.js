import './Action.css';
import { useEffect, useRef, useState } from 'react';
import { URL } from '../../Components/Helper/URL';

function Action() {
    const [databackup, setDataBackUp] = useState([]);
    const [data, setData] = useState([]);
    const [selectKey, setSelectKey] = useState('');
    const [selectInput, setSelectInput] = useState("");
    const [selectRow, setSelectRow] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [params, setParams] = useState({
        searchKey: "",
        searchValue: "",
        page: 1,
        limit: 10,
        sortKey: "",
        sortValue: "",
    });

    const inputRef = useRef(null);

    const updateParams = (newParams) => {
        setParams((prevParams) => ({ ...prevParams, ...newParams }));
    };

    const fetchApi = () => {
        const queryString = new URLSearchParams(params).toString();
        fetch(`${URL}/action?${queryString}`)
            .then(res => res.json())
            .then(data => {
                setData(data.results);
                setDataBackUp(data.results);
                setTotalPage(data.totalPages || 0);
            });
    };

    useEffect(() => {
        fetchApi();
    }, [params]);

    const handleChangeSelectKey = (e) => setSelectKey(e.target.value);
    const handleChangeSelectInput = (e) => setSelectInput(e.target.value);
    const handleChangeSelectRow = (e) => updateParams({ limit: e.target.value });

    const handleNextPage = () => {
        if (params.page < totalPage) updateParams({ page: params.page + 1 });
    };

    const handlePrePage = () => {
        if (params.page > 1) updateParams({ page: params.page - 1 });
    };

    const handleClickSearch = () => {
        const formattedSearchValue = selectKey === "time" && selectInput.length === 16
            ? `${selectInput}:00`
            : selectInput;

        updateParams({
            searchKey: selectKey,
            searchValue: formattedSearchValue || "",
            page: 1,
        });

        inputRef.current.value = "";
        inputRef.current.focus();
        setSelectInput("");
        setSelectKey("");
    };

    const handleClickSort = (sortKey) => {
        let sortValue = 'asc';
        if (params.sortKey === sortKey) {
            sortValue = params.sortValue === 'asc' ? 'desc' : "";
            sortKey = sortValue ? sortKey : "";
        }
        updateParams({ sortKey, sortValue, page: 1 });
    };
    return (
        <>
            <div className='action'>
                <h2 className="action-title">Action History</h2>
                <div className="option">
                    <div className="search">
                    <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search"
                            className="search__input"
                            onChange={handleChangeSelectInput}
                        />
                        <i className="fa-solid fa-magnifying-glass search__icon" onClick={handleClickSearch}></i>
                    </div>
                    <div className="select">
                        <select value={selectKey} className="select__list" onChange={handleChangeSelectKey}>
                            <option value='device'>Thiết bị</option>
                            <option value='action'>Hoạt động</option>
                            <option value='time'>Thời gian</option>
                            <option value='' hidden>-- Chọn giá trị --</option>
                        </select>
                    </div>
                    <div className="select2">
                        <select value={selectRow} className="select__list" onChange={handleChangeSelectRow}>
                            <option value={10}>10 hàng</option>
                            <option value={20}>20 hàng</option>
                            <option value={30}>30 hàng</option>
                            <option value='' hidden>-- Chọn giá trị --</option>
                        </select>
                    </div>
                </div>

                <div className='table__container'>
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th>ID</th>
                                <th>Thiết bị</th>
                                <th>Hành động</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.stt}</td>
                                    <td>{item.device}</td>
                                    <td>{item.action}</td>
                                    <td>{item.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='pagination'>
                    <ul className='pagi__list'>
                        <li className='pagi__pre' onClick={handlePrePage}>
                            {params.page > 1 && <i className="fa-solid fa-backward"></i>}
                        </li>
                        <li className='pagi__cur'>{params.page}</li>
                        <li className='pagi__next' onClick={handleNextPage}>
                            {params.page < totalPage && <i className="fa-solid fa-forward"></i>}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Action;
