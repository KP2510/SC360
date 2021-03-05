import React from 'react';
import TableSort from './TableSortColumn/TableSortColumn';
import CustomMultiSelectList from '../UI/CustomMultiSelectList';
import { compareArrays } from '../../utils/helper';
import { isEqual, cloneDeep, uniqBy, filter } from 'lodash';
import { Modal, Button, Tabs } from 'antd';

const { TabPane } = Tabs;

const TableDialog = (props) => {
    const [columnValue, setColumnValue] = React.useState([]);
    const [groupValue, setGroupValue] = React.useState([]);
    const [sortValue, setSortValue] = React.useState([]);
    const [disableReset, setResetDisable] = React.useState(true);
    const [columnNames, setColumnNames] = React.useState([]);

    React.useEffect(() => {
        const columnNames = [];
        props.columns.forEach(column => {
            columnNames.push(column.field)
        })
        setColumnNames(columnNames);
    }, [props.columns])

    React.useEffect(() => {
        setColumnValue(props.columnValue);
        setGroupValue(props.groupValue);
        setSortValue(cloneDeep(props.sortValue));
        setResetDisable(props.reset);
    }, [props.dialogState, props.columnValue, props.groupValue, props.sortValue, props.reset])

    const handleSelectAll = (type, selectAll) => {
        const setValue = selectAll ? [] : columnNames;
        if (type === 'column') {
            setColumnValue(setValue);
            updateResetButtonStatus(setValue, sortValue, groupValue);
        } else {
            setGroupValue(setValue);
            updateResetButtonStatus(columnValue, sortValue, setValue);
        }
    }

    const handleColumnToggle = (value) => {
        const currentIndex = columnValue.indexOf(value);
        const newChecked = [...columnValue];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setColumnValue(newChecked);
        updateResetButtonStatus(newChecked, sortValue, groupValue);
    };

    const handleGroupToggle = (value) => {
        const currentIndex = groupValue.indexOf(value);
        const newChecked = [...groupValue];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setGroupValue(newChecked);
        updateResetButtonStatus(columnValue, sortValue, newChecked);
    };

    const updateResetButtonStatus = (columnValue, sortValue, groupValue) => {
        if (compareArrays(props.selectedVariantModel.columnValue, columnValue) ||
            !isEqual(props.selectedVariantModel.sortValue, sortValue) ||
            compareArrays(props.selectedVariantModel.groupValue, groupValue)) {
            setResetDisable(false);
        } else {
            setResetDisable(true);
        }
    }

    const handleReset = () => {
        setResetDisable(true);
        setColumnValue(props.selectedVariantModel.columnValue);
        setGroupValue(props.selectedVariantModel.groupValue);
        setSortValue(props.selectedVariantModel.sortValue);
    };

    const validate = () => {
        const errorMessages = [];
        if (columnValue.length === 0) {
            errorMessages.push('Please select at least one column to display in table');
        }
        sortValue.every(sort => {
            if (sort.column !== 'none' && columnValue.indexOf(sort.column) === -1) {
                errorMessages.push('Please select sort columns which are visible in the table');
                return false
            } else {
                return true
            }
        })
        groupValue.every(group => {
            if (columnValue.indexOf(group) === -1) {
                errorMessages.push('Please select group columns which are visible in the table');
                return false
            } else {
                return true
            }
        })
        return errorMessages;
    }

    const onApply = () => {
        const errorMessages = validate();
        if (errorMessages.length) {
            const messages = errorMessages.map(msg => (
                <div key={msg}>
                    <p>{msg}</p>
                </div>
            ))
            Modal.error({
                title: 'Error',
                content: messages,
                zIndex: 1400
            });
        } else {
            const uniqueSortValues = uniqBy(sortValue, 'column');
            const sortValuesWithoutNone = filter(uniqueSortValues, uniqueSortValue => uniqueSortValue.column !== 'none');
            if (sortValuesWithoutNone.length === 0) {
                sortValuesWithoutNone.push({
                    column: 'none',
                    dir: 'asc'
                })
            }
            updateResetButtonStatus(columnValue, sortValuesWithoutNone, groupValue); // Todo: Handle Reset synchronously
            props.handleColumnSelectApply(columnValue, sortValuesWithoutNone, groupValue, disableReset);
        }
    }

    const handleSortOrderChange = (selectedIndex, value) => {
        const newSortList = cloneDeep(sortValue);
        newSortList[selectedIndex].dir = value;
        setSortValue(newSortList);
        updateResetButtonStatus(columnValue, newSortList, groupValue);
    };

    const handleColumnChange = (selectedIndex, value) => {
        const newSortList = cloneDeep(sortValue);
        newSortList[selectedIndex].column = value;
        setSortValue(newSortList);
        updateResetButtonStatus(columnValue, newSortList, groupValue);
    };

    const addSort = () => {
        const newSortList = cloneDeep(sortValue);
        newSortList.push({
            column: 'none',
            dir: 'asc'
        })
        setSortValue(newSortList);
        updateResetButtonStatus(columnValue, newSortList, groupValue);
    }

    const removeSort = (value) => {
        const newSortList = cloneDeep(sortValue);
        newSortList.splice(value, 1);
        if (newSortList.length === 0) {
            newSortList.push({
                column: 'none',
                dir: 'asc'
            })
        }
        setSortValue(newSortList);
        updateResetButtonStatus(columnValue, newSortList, groupValue);
    }

    return (
        <React.Fragment>
            <Modal
                closable={false}
                maskClosable={false}
                visible={props.dialogState}
                footer={[
                    <Button
                        onClick={handleReset}
                        type="primary"
                        disabled={disableReset}>
                        Reset
                    </Button>,
                    <Button onClick={props.handleColumnSelectCancel} type="primary">
                        Cancel
                    </Button>,
                    <Button onClick={onApply} type="primary" autoFocus>
                        Apply
                    </Button>
                ]}
            >
                <Tabs defaultActiveKey="columns">
                    <TabPane tab="Columns" key="columns" style={{ maxHeight: 300, overflowY: 'auto' }}>
                        <CustomMultiSelectList
                            columns={props.columns}
                            checked={columnValue}
                            type="column"
                            handleSelectAll={handleSelectAll}
                            handleToggle={handleColumnToggle} />
                    </TabPane>
                    <TabPane tab="Sort" key="sort" style={{ maxHeight: 300, overflowY: 'auto' }}>
                        <TableSort
                            sortingList={sortValue}
                            addSort={addSort}
                            removeSort={removeSort}
                            columnList={props.radioList}
                            handleSortOrderChange={handleSortOrderChange}
                            handleColumnChange={handleColumnChange} />
                    </TabPane>
                    <TabPane tab="Group" key="group" style={{ maxHeight: 300, overflowY: 'auto' }}>
                        <CustomMultiSelectList
                            columns={props.columns}
                            checked={groupValue}
                            type="group"
                            handleSelectAll={handleSelectAll}
                            handleToggle={handleGroupToggle} />
                    </TabPane>
                </Tabs>
            </Modal>
        </React.Fragment>
    );
}

export default TableDialog;