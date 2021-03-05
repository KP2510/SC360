import React from 'react';
import { List, Checkbox } from 'antd';

const CustomMultiSelectList = (props) => {
    const isSelectAll = props.checked.length === props.columns.length;
    return (
        <React.Fragment>
            <Checkbox
                style={{borderBottom: '1px solid #f0f0f0', width: '100%', padding: '12px 0'}}
                checked={isSelectAll}
                onChange={props.handleSelectAll.bind(null, props.type, isSelectAll)}
            >Select All</Checkbox>
            <List
                dataSource={props.columns}
                renderItem={column => (
                    <List.Item>
                        <Checkbox
                            checked={props.checked.indexOf(column.field) !== -1}
                            onChange={props.handleToggle.bind(null, column.field)}>{column.title}</Checkbox>
                    </List.Item>
                )}
            />
        </React.Fragment>
    )
}

export default CustomMultiSelectList;
