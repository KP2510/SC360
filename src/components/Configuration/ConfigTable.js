import React from 'react';
import { Table, Select } from 'antd';
import 'antd/dist/antd.css';
import { constants } from '../../shared/constant';
import axios from '../../utils/axios-instance';
import { cloneDeep } from 'lodash';

const ConfigTable = (props) => {
    const { Option } = Select;
    const getTitle = {
        cards: 'Cards',
        tables: 'Column',
        tabs: 'Sub -tabs',
        osKPI: 'KPI Tiles',
        reportTiles: 'Report Tiles'
    };
    const [selectedControl, setSelectedControl] = React.useState("cards");
    const [selectedColumns, setSelectedColumns] = React.useState();
    const [selectedTableKey, setSelectedTableKey] = React.useState();
    const [tableColumns, setTableColumns] = React.useState({});

    React.useEffect(() => {
        setSelectedControl('cards');
        setSelectedTableKey(null);
    }, [props.onPressGo])

    const renderTableColumns = (selectedPersId) => {
        if (!tableColumns[selectedPersId]) {
            axios.get(`/model/view/columns/${selectedPersId}`)
                .then(response => {
                    const existingTableColumns = cloneDeep(tableColumns);
                    const viewName = response.data.data.viewName;
                    const columnData = Object.entries(response.data.data.viewsCol).map(column => {
                        return {
                            key: `${column[0]}&${viewName}&${selectedPersId}`,
                            value: column[0],
                            text: column[1]
                        }
                    })
                    existingTableColumns[selectedPersId] = columnData;
                    setTableColumns(existingTableColumns);
                })
                .catch(error => console.log(error))
        }
    }

    const handleTableChange = (value) => {
        if (value && selectedControl === 'tables') {
            const selectedColumns = [];
            setSelectedTableKey(`${value}`);
            renderTableColumns(value);
            const selectedTables = props.selectedPersonaData.table.filter(table => {
                return table.persID === `${value}`
            })
            selectedTables.forEach(table => {
                table.mapped_column.forEach(column => {
                    if (column.visibility) {
                        selectedColumns.push(column.dbcolumn)
                    }
                })
            })
            setSelectedColumns(selectedColumns)
        }
    }

    const handleColumnChange = (value, selectedColumnsData) => {
        setSelectedColumns(value);
        props.handleColumnChange(selectedTableKey, selectedColumnsData);
    }

    const getColumns = (columnData) => {
        if (props.adminData.length) {
            switch (selectedControl) {
                case 'cards':
                    if (columnData.cards) {
                        return (
                            <Select
                                maxTagCount={2}
                                maxTagTextLength={10}
                                mode="multiple"
                                style={{ width: '300px' }}
                                placeholder="Please select cards"
                                value={props.selectedPersonaData.cards.map(card => {
                                    return parseInt(card.cardID)
                                })}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={props.handleCardChange}
                            >
                                {props.adminData[0].cards.map(card => (
                                    <Option key={card.cardID} value={card.cardID}>{card.cardName}</Option>
                                ))}
                            </Select>
                        )
                    } else {
                        return (<Select
                            style={{ width: '300px' }}
                            placeholder='Please select cards'
                            disabled={true}
                        >
                        </Select>)
                    }
                case 'tables':
                    if (columnData.columns && selectedTableKey && tableColumns[selectedTableKey]) {
                        return (
                            <Select
                                maxTagCount={2}
                                maxTagTextLength={10}
                                mode="multiple"
                                style={{ width: '300px' }}
                                value={selectedColumns}
                                onChange={handleColumnChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="Please select columns"
                            >
                                {tableColumns[selectedTableKey].map(column => (
                                    <Option key={column.key} value={column.value}>{column.text}</Option>
                                ))}
                            </Select>
                        )
                    } else {
                        return (<Select
                            style={{ width: '300px' }}
                            placeholder='Please select columns'
                            disabled={true}
                        >
                        </Select>)
                    }
                case 'tabs':
                    return (
                        <Select
                            maxTagCount={2}
                            maxTagTextLength={10}
                            mode="multiple"
                            style={{ width: '300px' }}
                            placeholder="Please select tabs"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.adminData[0].tabs.map(tab => (
                                <Option key={tab.tab_name} value={tab.tab_name}>{tab.tab_name}</Option>
                            ))}
                        </Select>
                    )
                default:
                    return (
                        <Select
                            style={{ width: '300px' }}
                            disabled={true}
                        >
                        </Select>
                    )
            }
        }
    }
    const handleControlSelect = (selectedControl) => {
        setSelectedControl(selectedControl);
    }

    const columns = [
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view'
        },
        {
            title: 'Control',
            dataIndex: 'control',
            key: 'control',
            render: control => {
                if (control) {
                    return (
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a control"
                            optionFilterProp="children"
                            defaultValue={['cards']}
                            onChange={handleControlSelect}
                            value={selectedControl}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            <Option key="cards" value="cards">Cards</Option>
                            <Option key="tables" value="tables">Tables (with columns)</Option>
                            <Option key="tabs" value="tabs">Tabs (with sub-tabs)</Option>
                            <Option key="osKPI" value="osKPI">Operational status KPIs</Option>
                            <Option key="reportTiles" value="reportTiles">Report tiles</Option>
                        </Select>
                    )
                } else {
                    return (<Select
                        style={{ width: 200 }}
                        disabled={true}
                        placeholder="Please select control"
                    >
                    </Select>)
                }
            }
        },
        {
            title: selectedControl === 'tables' ? 'Table' : 'Attributes',
            dataIndex: selectedControl === 'tables' ? 'table' : 'attributes',
            key: selectedControl === 'tables' ? 'table' : 'attributes',
            render: enable => {
                if (enable) {
                    return (
                        <Select
                            showSearch
                            disabled={selectedControl !== 'tables'}
                            style={{ width: 200 }}
                            placeholder="Select a table"
                            optionFilterProp="children"
                            onChange={handleTableChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            <Option key={constants.PERSID_OPENPO} value={constants.PERSID_OPENPO}>Open PO</Option>
                            <Option key={constants.PERSID_BACKLOG} value={constants.PERSID_BACKLOG}>Backlog</Option>
                            <Option key={constants.PERSID_SHORTAGE} value={constants.PERSID_SHORTAGE}>Shortage Report</Option>
                            <Option key={constants.PERSID_SHIPMENTS} value={constants.PERSID_SHIPMENTS}>Ship Log</Option>
                            <Option key={constants.PERSID_BOOKINGVSFORECAST} value={constants.PERSID_BOOKINGVSFORECAST}>Booking vs Forecast</Option>
                            <Option key={constants.PERSID_OPENORDER} value={constants.PERSID_OPENORDER}>Open Order</Option>
                            <Option key={constants.PERSID_BUILDPLAN} value={constants.PERSID_BUILDPLAN}>Build Plan</Option>
                            <Option key={constants.PERSID_DEALTRACKER} value={constants.PERSID_DEALTRACKER}>Deal Tracker</Option>
                        </Select>
                    )
                } else {
                    return (<Select
                        style={{ width: 200 }}
                        disabled={true}
                        placeholder="Please select attributes"
                    ></Select>)
                }
            }
        },
        {
            title: getTitle[selectedControl],
            dataIndex: 'options',
            key: 'options',
            render: columnData => getColumns(columnData)
        }
    ];

    const data = [
        {
            key: '1',
            view: 'Home',
            control: true,
            table: true,
            attributes: true,
            options: { cards: true, columns: true }
        },
        {
            key: '2',
            view: 'Shortage Management',
            control: false,
            table: false,
            attributes: false,
            options: { cards: false, columns: false }
        },
        {
            key: '3',
            view: 'Consol',
            control: false,
            table: false,
            attributes: false,
            options: { cards: false, columns: false }
        },
        {
            key: '4',
            view: 'WW Summary',
            control: false,
            table: false,
            attributes: false,
            options: { cards: false, columns: false }
        },
        {
            key: '5',
            view: 'Reports',
            control: false,
            table: false,
            attributes: false,
            options: { cards: false, columns: false }
        }
    ];
    return (
        <Table columns={columns} dataSource={data} pagination={false} />
    )
}

export default ConfigTable;