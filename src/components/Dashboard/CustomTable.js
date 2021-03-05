import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import { ReactTabulator } from 'react-tabulator';
import VariantManagement from '../../components/VariantManagement/VariantManagement';
import TableDialog from '../../components/TableDialog/TableDialog';
import VariantDialog from '../../components/VariantDialog/VariantDialog';
import ManageDialog from '../../components/ManageDialog/ManageDialog';
import axios from '../../utils/axios-instance';
import { compareArrays } from '../../utils/helper';
import { isEqual, cloneDeep, remove } from 'lodash';
import { Menu, Dropdown, Typography, Button, Tooltip, Input } from 'antd';
import { DownloadOutlined, DownOutlined, SettingFilled, FileExcelOutlined } from '@ant-design/icons';
import './CustomTable.css';
import { showMessage } from '../../components/UI/ToastMessage';
import config from '../../config';

const { Text } = Typography;
const { Search } = Input;
class CustomTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [],
            rowData: [],
            totalRows: 0,
            buttonAnchorEl: null,
            selectedVariant: '',
            dialogState: false,
            manageDialogState: false,
            variantDialogState: false,
            columnValue: [],
            reset: true,
            sortValue: [{ column: 'none', dir: 'asc' }],
            groupValue: [],
            defaultSortValue: null,
            defaultGroupValue: null,
            selectedDefaultVariant: '',
            tablePersonalisationModel: {
            },
            filterVariantType: {
            },
            defaultFilter: "",
            currentFilter: "",
            isFilterVariantLoading: true,
            selectedValue: 8,
            userID: null
        };
    }

    productBaseFormatter = (event) => {
        return (
            `<div>
                <a style={{ textDecoration: 'none' }}>${event.getValue()}</a>
            </div>`)
    }

    componentDidMount = () => {
        const userID = this.props.userInfo.id;
        this.table = null;
        const parentData = this.props.data
        const columns = [];
        const rowData = parentData.data || parentData.columnData;
        let columnValues = {};
        if (parentData.mapped_column) {
            parentData.mapped_column.forEach((column) => {
                columnValues = {
                    title: column.dbcoltxt,
                    field: column.dbcolumn,
                    formatter: column.formatter,
                    frozen: this.props.freezedColumns && this.props.freezedColumns.indexOf(column.field) > -1,
                    headerSort: false
                };
                if (column.dbcolumn === 'product_base' && this.props.tableType === 'general') {
                    columnValues.formatter = this.productBaseFormatter
                }
                columns.push(columnValues)
            });
        } else {
            parentData.columns.forEach((column) => {
                columnValues = {
                    title: column.displayName,
                    formatter: column.formatter,
                    field: column.field,
                    frozen: this.props.freezedColumns && this.props.freezedColumns.indexOf(column.field) > -1,
                    headerSort: false
                }
                columns.push(columnValues)
            });
        }
        this.setState({
            columnDefs: columns,
            rowData: rowData,
            totalRows: rowData.length,
            userID
        })
        if (this.props.cardType === 'big') {
            this.props.getVariants(this.props.userInfo.id, this.props.persID);
        }
    };

    componentDidUpdate = () => {
        if (this.props.variants[this.props.persID] && this.table && !Object.keys(this.state.tablePersonalisationModel).length) {
            this.getStructuredData(this.props.variants[this.props.persID]);
        }
    }

    layoutMenu = (data) => {
        return (
            <Menu onClick={this.onClick}>
                {
                    data.map(subMenu => {
                        return (<Menu.Item key={subMenu} type={subMenu}>{subMenu}</Menu.Item>);
                    })
                } </Menu>
        );
    }


    onClick = async ({ key, domEvent }) => {
        await this.setState({ selectedValue: domEvent.target.innerText })
        this.table.setPageSize(this.state.selectedValue)
    };

    rearrangeColumns = (modelData) => {
        const columns = cloneDeep(this.state.columnDefs);
        let updatedColumnDefs = [];
        let findColumn = null;
        const modelColumns = modelData.column || modelData.columnValue;
        modelColumns.forEach(column => {
            findColumn = remove(columns, function (item) {
                return column === item.field
            })
            updatedColumnDefs.push(findColumn[0])
        })
        updatedColumnDefs = [...updatedColumnDefs, ...columns];
        this.table.setColumns(updatedColumnDefs);
    }

    getStructuredData = (responseData) => {
        const structuredModel = {};
        let defaultVariant = null;
        responseData.forEach(data => {
            structuredModel[data.variantID] = {
                id: data.variantID,
                persID: data.persID,
                columnValue: data.table.column,
                groupValue: data.table.group,
                sortValue: data.table.sort.map(sorter => ({ column: sorter.id, dir: sorter.order.toLowerCase() })),
                visibility: data.visibility,
                createdBy: data.userID,
                createdByName: data.createdByName,
                visibleToUsers: data.visibleToUsers,
                visibleToUsersGroup: data.visibleToUsersGroup
            }
            if (data.default) {
                defaultVariant = data.variantID;
            }
            if (structuredModel[data.variantID].sortValue.length === 0) {
                structuredModel[data.variantID].sortValue.push({
                    column: 'none',
                    dir: 'asc'
                })
            }
        })
        this.setState({
            selectedDefaultVariant: defaultVariant,
            selectedVariant: defaultVariant,
            tablePersonalisationModel: structuredModel
        }, () => {
            const selectedVariantModel = cloneDeep(structuredModel[defaultVariant]);
            this.handleColumnSelectApply(selectedVariantModel.columnValue, selectedVariantModel.sortValue, selectedVariantModel.groupValue, true)
        })
    }

    handleSearch = (event) => {
        const searchValue = event.target.value;
        if (searchValue && searchValue.trim() !== '') {
            const filters = [];
            this.props.data.columns.forEach((column) => {
                filters.push({
                    field: column.field,
                    type: "like",
                    value: searchValue
                })
            });
            this.table.setFilter([filters])
        } else {
            this.table.clearFilter();
        }
        const totalRows = this.table.getDataCount('active');
        this.setState({
            totalRows
        });
    }

    handleSaveVariant = () => {
        const existingVariantModel = cloneDeep(this.state.tablePersonalisationModel);
        const variantName = this.state.selectedVariant.split('*')[0];
        existingVariantModel[variantName].columnValue = this.state.columnValue;
        existingVariantModel[variantName].sortValue = this.state.sortValue;
        existingVariantModel[variantName].groupValue = this.state.groupValue;
        const payload = this.restructurePayload(cloneDeep(existingVariantModel[variantName]), variantName);
        axios.put('/variants', payload)
            .then((response) => {
                showMessage('Variant updated successfully', 'Success');
                this.setState({
                    tablePersonalisationModel: existingVariantModel,
                    variantDialogState: false,
                    selectedVariant: variantName,
                    reset: true,
                    buttonAnchorEl: null
                })
            })
            .catch(error => {
                showMessage('Variant updation failed', 'Error');
                console.log(error)
            })
    }


    restructurePayload = (modelData, variantName) => {
        const structuredPayload = {
            table: {}
        };
        structuredPayload.table.column = modelData.columnValue;
        structuredPayload.table.sort = modelData.sortValue.map(sorter => ({ id: sorter.column, order: sorter.dir.toUpperCase() }));
        structuredPayload.table.group = modelData.groupValue;
        structuredPayload.variantID = variantName;
        structuredPayload.default = variantName === this.state.selectedDefaultVariant;
        structuredPayload.userID = this.state.userID;
        structuredPayload.visibility = modelData.visibility;
        if (modelData.visibleToUsers && modelData.visibleToUsers.length) {
            structuredPayload.visibleToUsers = modelData.visibleToUsers;
        }
        if (modelData.visibleToUsersGroup && modelData.visibleToUsersGroup.length) {
            structuredPayload.visibleToUsersGroup = modelData.visibleToUsersGroup;
        }
        structuredPayload.persID = this.props.persID;
        if (structuredPayload.table.sort.length === 1 && structuredPayload.table.sort[0].id === 'none') {
            structuredPayload.table.sort = [];
        }
        return structuredPayload;
    }

    handleSaveAsVariant = (sharing, variantName) => {
        if (variantName && variantName.trim() !== '') {
            const existingPersonalisationModel = cloneDeep(this.state.tablePersonalisationModel);
            existingPersonalisationModel[variantName] = {
                columnValue: this.state.columnValue,
                sortValue: this.state.sortValue,
                groupValue: this.state.groupValue,
                visibility: sharing,
                createdBy: parseInt(this.state.userID),
                createdByName: this.props.login.userInfo.name,
                persID: this.props.persID
            };
            const payload = this.restructurePayload(cloneDeep(existingPersonalisationModel[variantName]), variantName);
            axios.post('/variants', payload)
                .then((response) => {
                    showMessage('Variant created successfully', 'Success');
                    existingPersonalisationModel[variantName].id = response.data.data.variantID;
                    this.setState({
                        tablePersonalisationModel: existingPersonalisationModel,
                        variantDialogState: false,
                        selectedVariant: variantName,
                        reset: true,
                        buttonAnchorEl: null
                    })
                })
                .catch(error => {
                    showMessage('Variant creation failed', 'Error');
                    console.log(error)
                })
        }
    }

    handleDeleteVariant = (deletedVariantName) => {
        const existingColumnModel = cloneDeep(this.state.tablePersonalisationModel);
        let selectedVariant = this.state.selectedVariant.split('*')[0];
        let defaultVariant = this.state.selectedDefaultVariant;
        let { columnValue, sortValue, groupValue } = this.state;
        let reset = this.state.reset;
        axios.delete(`/variants`,
            {
                data: { variantID: deletedVariantName, persID: existingColumnModel[deletedVariantName].persID }
            })
            .then(() => {
                showMessage('Variant deleted successfully', 'Success');
                delete existingColumnModel[deletedVariantName];
                if (deletedVariantName === selectedVariant) {
                    selectedVariant = 'Standard';
                    defaultVariant = 'Standard';
                    columnValue = existingColumnModel[selectedVariant].columnValue;
                    sortValue = existingColumnModel[selectedVariant].sortValue;
                    groupValue = existingColumnModel[selectedVariant].groupValue;
                    existingColumnModel[selectedVariant].default = true;
                    this.applyVariantOnTable(existingColumnModel[selectedVariant], columnValue, sortValue, groupValue);
                    reset = true;
                }
                this.setState({
                    tablePersonalisationModel: existingColumnModel,
                    buttonAnchorEl: null,
                    selectedVariant: selectedVariant,
                    columnValue,
                    sortValue,
                    groupValue,
                    reset,
                    selectedDefaultVariant: defaultVariant,
                    totalRows: this.table.getDataCount('active')
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    resetColumnState = () => {
        this.state.columnDefs.forEach((column) => {
            this.table.showColumn(column.field)
        })
    }

    handleSelectVariant = (event) => {
        const selectedVariant = event.target.outerText;
        if (selectedVariant) {
            const selectedPersonalisationModel = this.state.tablePersonalisationModel[selectedVariant];
            const { columnValue, sortValue, groupValue } = selectedPersonalisationModel;
            this.applyVariantOnTable(selectedPersonalisationModel, columnValue, sortValue, groupValue);
            this.setState({
                buttonAnchorEl: null,
                selectedVariant: selectedVariant,
                columnValue,
                sortValue,
                groupValue
            })
        }
    }

    applyVariantOnTable = (variantModel, columnValue, sortValue, groupValue) => {
        const groupBy = [];
        this.rearrangeColumns(variantModel);
        this.state.columnDefs.forEach((column) => {
            if (columnValue.indexOf(column.field) !== -1) {
                this.table.showColumn(column.field)
            } else {
                this.table.hideColumn(column.field)
            }
        })
        if ((sortValue.length === 1 && sortValue[0].column === 'none') || sortValue.length === 0) {
            this.table.clearSort();
        } else {
            this.table.setSort(cloneDeep(sortValue))
        }
        this.state.columnDefs.forEach((column) => {
            if (groupValue.indexOf(column.field) !== -1) {
                groupBy.push(column.field)
            }
        })
        this.table.setGroupBy(groupBy);
    }

    handleVariantOpen = (event) => {
        this.setState({
            buttonAnchorEl: event.currentTarget
        })
    }

    handleVariantClose = () => {
        this.setState({
            buttonAnchorEl: null
        })
    }

    handleTableSettings = () => {
        this.setState({
            dialogState: true
        })
    }

    handleTableDialogClose = () => {
        this.setState({
            dialogState: false
        })
    }

    handleColumnSelectApply = (columnValue, sortValue, groupValue, reset) => {
        const selectedVariant = this.state.selectedVariant.split('*')[0];
        let updatedVariant = null;
        const selectedPersonalisationModel = this.state.tablePersonalisationModel[selectedVariant];
        this.applyVariantOnTable(selectedPersonalisationModel, columnValue, sortValue, groupValue);
        if (compareArrays(selectedPersonalisationModel.columnValue, columnValue) ||
            !isEqual(selectedPersonalisationModel.sortValue, sortValue) ||
            compareArrays(selectedPersonalisationModel.groupValue, groupValue)) {
            updatedVariant = selectedVariant + '*';
        } else {
            updatedVariant = selectedVariant;
        }
        this.setState({
            columnValue,
            sortValue,
            groupValue,
            reset,
            selectedVariant: updatedVariant,
            dialogState: false
        })

    }

    setTableReference = (reference) => {
        if (reference && reference.table) {
            this.table = reference.table
        }
    }

    handleColumnSelectCancel = () => {
        this.setState({
            dialogState: false
        })
    }

    handleOpenVariantDialog = () => {
        this.setState({
            variantDialogState: true
        })
    }

    handleVariantDialogClose = () => {
        this.setState({
            variantDialogState: false
        })
    }

    handleOpenManageDialog = () => {
        this.setState({
            manageDialogState: true,
            buttonAnchorEl: null
        })
    }

    handleCloseManageDialog = () => {
        this.setState({
            manageDialogState: false
        })
    }

    handleApplyManageDialog = (selectedDefaultVariant, updatedManagementModel) => {
        const existingVariantModel = cloneDeep(this.state.tablePersonalisationModel);
        if (updatedManagementModel) {
            const updatedData = this.getBulkUpdateData(selectedDefaultVariant, updatedManagementModel, existingVariantModel);
            axios.put('/bulkvariants', updatedData.payload)
                .then((response) => {
                    showMessage('Variants updated successfully', 'Success');
                    this.setState({
                        selectedDefaultVariant,
                        tablePersonalisationModel: updatedData.existingVariantModel,
                        manageDialogState: false
                    })
                })
                .catch(error => {
                    showMessage('Variants updation failed', 'Error');
                    console.log(error)
                })
        } else {
            this.setState({
                manageDialogState: false
            })
        }
    }

    getBulkUpdateData = (defaultVariant, updatedModel, existingVariantModel) => {
        const payload = [];
        Object.keys(updatedModel).forEach(variant => {
            updatedModel[variant].default = variant === defaultVariant;
            const variantData = {};
            variantData.variantID = variant;
            variantData.persID = this.props.persID;
            variantData.userID = updatedModel[variant].createdBy;
            variantData.default = variant === defaultVariant;
            if (updatedModel[variant].createdBy === parseInt(this.state.userID) && variant.toLowerCase() !== 'standard') {
                variantData.visibility = updatedModel[variant].visibility;
                if (updatedModel[variant].visibleToUsers && updatedModel[variant].visibleToUsers.length) {
                    variantData.visibleToUsers = updatedModel[variant].visibleToUsers;
                }
                if (updatedModel[variant].visibleToUsersGroup && updatedModel[variant].visibleToUsersGroup.length) {
                    variantData.visibleToUsersGroup = updatedModel[variant].visibleToUsersGroup;
                }
            }
            payload.push(variantData);
            existingVariantModel[variant] = updatedModel[variant];
        })
        return { payload, existingVariantModel };
    }

    columnMoved = () => {
        const updatedColumns = this.table.getColumnDefinitions().map(column => {
            if (this.state.columnValue.indexOf(column.field) !== -1) {
                return column.field
            }
            return false;
        }).filter(column => column);
        this.setState({
            columnValue: updatedColumns,
            selectedVariant: `${this.state.selectedVariant.split('*')[0]}*`,
            reset: false
        })
    }

    rowSelected = (row) => {
        const rowDetail = row.getData()
        if (!this.props.communication.isLocked) {
            rowDetail.persId = this.props.persID
            this.props.getRow(rowDetail);
            const payload = {
                "pageNo": "1",
                "perPage": `${config.MESSAGE_PER_PAGE}`,
                "persId": "",
                "commentedOnId": rowDetail.product_base,
                "text": "",
                "tags": [],
                "priority": "",
                "userGroups": [],
                "emails": [],
                "endDate": "",
                "startDate": "",
            }
            this.props.searchMessageRequest(payload)
        }
    }
    rowDeselected = (row) => {
        if (!this.props.communication.isLocked) {
            this.props.deSelectRow({});
            this.props.addMessageRequest([])
        }


    }

    handleExcelDownload = () => {
            console.log("arubaaaa",this.table)
        this.table.download("xlsx", "data.xlsx", {
            sheetName: "My Data"
        });
    }

    render() {
        const { selectedValue } = this.state
        const variantManagement = (
            <React.Fragment>
                <TableDialog
                    selectedVariantModel={this.state.tablePersonalisationModel[this.state.selectedVariant.split('*')[0]]}
                    handleColumnSelectCancel={this.handleColumnSelectCancel}
                    handleColumnSelectApply={this.handleColumnSelectApply}
                    columnValue={this.state.columnValue}
                    reset={this.state.reset}
                    groupValue={this.state.groupValue}
                    sortValue={this.state.sortValue}
                    columns={this.state.columnDefs}
                    radioList={this.state.columnDefs}
                    handleTableDialogClose={this.handleTableDialogClose}
                    handleColumnSelection={this.handleColumnSelection}
                    dialogState={this.state.dialogState} />
                <VariantDialog
                    tablePersonalisationModel={this.state.tablePersonalisationModel}
                    handleVariantInput={this.handleVariantInput}
                    handleSaveAsVariant={this.handleSaveAsVariant}
                    variantDialogState={this.state.variantDialogState}
                    handleVariantDialogClose={this.handleVariantDialogClose} />
                <ManageDialog
                    userID={this.state.userID}
                    users={this.props.users}
                    userGroup={this.props.userGroup}
                    handleApplyManageDialog={this.handleApplyManageDialog}
                    selectedDefaultVariant={this.state.selectedDefaultVariant}
                    manageVariantList={this.state.tablePersonalisationModel}
                    manageDialogState={this.state.manageDialogState}
                    handleCloseManageDialog={this.handleCloseManageDialog}
                />
            </React.Fragment>
        )

        return (
            <React.Fragment key={this.props.name}>
                {this.props.tableType !== 'parent' ? variantManagement : null}
                {this.state.rowData.length ?
                    <div style={{ height: this.props.height ? this.props.height : '400px' }}>
                        <div className="table-controls" style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', margin: 5 }}>
                            {this.props.tableType === 'child' ? (
                                <React.Fragment>
                                    {this.props.cardType === 'big' ?
                                        (<React.Fragment>
                                            <Tooltip title="Table Settings" placement="bottom">
                                                <Button
                                                    shape="circle"
                                                    onClick={this.handleTableSettings}
                                                    icon={<SettingFilled />} />
                                            </Tooltip>
                                            <Tooltip title="Download" placement="bottom">
                                                <Button style={{ marginRight: 5 }} shape="circle" icon={<DownloadOutlined />} onClick={this.handleExcelDownload} />
                                            </Tooltip>
                                        </React.Fragment>)
                                        : null}
                                    <Dropdown
                                        overlay={this.layoutMenu([2, 4, 8, 16])}
                                        trigger={['click']}>
                                        <div className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', marginRight: 10, marginLeft: 10 }} >
                                            <Text>
                                                <span style={{ display: 'inlineBlock', width: '50px', marginRight: '2px' }}>Page Size</span>
                                                <span style={{ fontWeight: 'bold', marginRight: '2px' }}> {selectedValue}</span>
                                            </Text>
                                            <DownOutlined />
                                        </div>
                                    </Dropdown>
                                    <Input.Search
                                        placeholder="Search..."
                                        onSearch={value => console.log(value)}
                                        style={{ width: 200 }}
                                    />
                                    {this.props.cardType === 'big' ?
                                        <VariantManagement
                                            selectedVariantModel={this.state.tablePersonalisationModel[this.state.selectedVariant.split('*')[0]]}
                                            userID={this.state.userID}
                                            reset={this.state.reset}
                                            selectedDefaultVariant={this.state.selectedDefaultVariant}
                                            handleOpenVariantDialog={this.handleOpenVariantDialog}
                                            handleOpenManageDialog={this.handleOpenManageDialog}
                                            selectedVariant={this.state.selectedVariant}
                                            tablePersonalisationModel={this.state.tablePersonalisationModel}
                                            buttonAnchorEl={this.state.buttonAnchorEl}
                                            handleDeleteVariant={this.handleDeleteVariant}
                                            handleSelectVariant={this.handleSelectVariant}
                                            handleVariantOpen={this.handleVariantOpen}
                                            handleVariantClose={this.handleVariantClose}
                                            handleSaveVariant={this.handleSaveVariant}
                                        /> : null}
                                </React.Fragment>
                            ) : (
                                    <React.Fragment>
                                        <Tooltip title="Table Settings" placement="bottom">
                                            <Button
                                                shape="circle"
                                                onClick={this.handleTableSettings}
                                                icon={<SettingFilled />} />
                                        </Tooltip>
                                        <Tooltip title="Download" placement="bottom">
                                            <Button style={{ marginRight: 5 }} shape="circle" icon={<DownloadOutlined />} />
                                        </Tooltip>
                                        <Search
                                            placeholder="search"
                                            style={{ width: 300, marginRight: 10 }}
                                        />
                                        <Text strong style={{ flexGrow: 1 }}>SKU DATA</Text>
                                    </React.Fragment>
                                )}

                        </div>
                        <ReactTabulator
                            options={{
                                pagination: 'local',
                                paginationSize: this.props.tableType !== 'parent' ? selectedValue : 16,
                                paginationButtonCount: 5,
                                selectable: 1,
                                selectableCheck: function (row) { return row.getData() },
                                rowSelected: (row) => { this.rowSelected(row) },
                                rowDeselected: (row) => { this.rowDeselected(row) },
                                maxHeight: '80%',
                                movableColumns: true,
                                layoutColumnsOnNewData: true,
                                downloadReady: (fileContents, blob) => blob,
                                columnMinWidth: 150
                            }}
                            ref={ref => { this.setTableReference(ref) }}
                            columnMoved={this.columnMoved}
                            columns={this.state.columnDefs}
                            data={this.state.rowData}
                            tooltips={true} />
                    </div> : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login,
        userInfo: state.login.userInfo,
        variants: state.variants,
        communication: state.communication
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getVariants: (userId, persID) => dispatch(actions.getVariants({ userId, persID })),
        getRow: (payload) => dispatch(actions.getRowDetail(payload)),
        deSelectRow: (payload) => dispatch(actions.removeRowDetail(payload)),
        addMessageRequest: (payload) => dispatch(actions.addMessageRequest(payload)),
        searchMessageRequest: (payload) => dispatch(actions.searchMessageRequest(payload)),
        addDropdownRequest: (payload) => dispatch(actions.addDropdownRequest(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);