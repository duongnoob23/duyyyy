import React from 'react';
import { Table } from 'antd';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Chinese Score',
    dataIndex: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Math Score',
    dataIndex: 'math',
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: 'English Score',
    dataIndex: 'english',
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: '2',
    name: 'Jim Green',
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: '3',
    name: 'Joe Black',
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: '4',
    name: 'Jim Red',
    chinese: 88,
    math: 99,
    english: 89,
  },
];
const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};
const App = () => <Table columns={columns} dataSource={data} onChange={onChange} />;
export default App;
    //     { id: 1, nhietDo: 24.7, doAm: 55, anhSang: 400, thoiGian: "2024-08-25 14:00" },
    //     { id: 2, nhietDo: 25.5, doAm: 60, anhSang: 350, thoiGian: "2024-08-25 14:05" },
    //     { id: 3, nhietDo: 23.9, doAm: 50, anhSang: 450, thoiGian: "2024-08-25 14:10" },
    //     { id: 4, nhietDo: 26.3, doAm: 65, anhSang: 380, thoiGian: "2024-08-25 14:15" },
    //     { id: 5, nhietDo: 24.2, doAm: 70, anhSang: 420, thoiGian: "2024-08-25 14:20" },
    //     { id: 6, nhietDo: 25.8, doAm: 75, anhSang: 410, thoiGian: "2024-08-25 14:25" },
    //     { id: 7, nhietDo: 24.0, doAm: 55, anhSang: 430, thoiGian: "2024-08-25 14:30" },
    //     { id: 8, nhietDo: 25.2, doAm: 60, anhSang: 470, thoiGian: "2024-08-25 14:35" },
    //     { id: 9, nhietDo: 23.7, doAm: 58, anhSang: 440, thoiGian: "2024-08-25 14:40" },
    //     { id: 10, nhietDo: 26.1, doAm: 72, anhSang: 390, thoiGian: "2024-08-25 14:45" }
    // ];