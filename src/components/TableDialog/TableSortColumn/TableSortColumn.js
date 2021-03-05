import React from 'react';
import { Select, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';


const { Option } = Select;

export default function TableSortColumn(props) {
    const columns = [...props.columnList];
    const sortingList = [...props.sortingList];

    columns.unshift({
        title: '(none)', field: 'none'
    })

    const columnNames = columns.map(list => {
        return (
            <Option key={list.field} value={list.field}>{list.title}</Option>
        )
    });

    const sortList = sortingList.map((list, index) => {
        return (
            <div
                key={`customList${list.column}${Math.random()}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <Select
                    value={list.column}
                    style={{ width: 180 }}
                    onChange={props.handleColumnChange.bind(null, index)}>
                    {columnNames}
                </Select>
                <Select
                    value={list.dir}
                    style={{ width: 180 }}
                    disabled={list.column === 'none'}
                    onChange={props.handleSortOrderChange.bind(null, index)}>
                    <Option value={'asc'}>Ascending</Option>
                    <Option value={'desc'}>Descending</Option>
                </Select>
                <div>
                    <Button
                        ghost={true}
                        shape="circle"
                        style={{ color: 'black', marginRight: 5 }}
                        onClick={props.addSort.bind(null, index)}
                        icon={<PlusOutlined />} />
                    <Button
                        ghost={true}
                        shape="circle"
                        style={{ color: 'black' }}
                        onClick={props.removeSort.bind(null, index)}
                        icon={<MinusOutlined />} />
                </div>
            </div>
        )
    })
    return (
        <>
            {sortList}
        </>
    );
}