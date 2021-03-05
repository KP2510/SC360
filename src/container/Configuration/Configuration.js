import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Select, Modal } from 'antd';
import axios from '../../utils/axios-instance';
import ConfigTable from '../../components/Configuration/ConfigTable';
import ConfigHeader from '../../components/Configuration/ConfigHeader';
import { cloneDeep, remove, uniq } from 'lodash';
import { showMessage } from '../../components/UI/ToastMessage';
import { constants } from '../../shared/constant';

const { Option } = Select;
class Configuration extends Component {

    state = {
        adminData: [],
        jobRoles: [],
        emeaDefaultColumns: [],
        apjDefaultColumns: [],
        emeaChildren: [],
        apjChildren: [],
        selectedEmeaColumns: [],
        selectedApjColumns: [],
        selectedUserGroup: 'emea',
        tableColumns: [],
        actualJobRoles: [],
        apiType: null,
        userGroup: null,
        persona: null,
        scope: null,
        jobRoleId: null,
        selectedPersonaData: {
            cards: [],
            tables: [],
            tabs: [],
            mapID: null
        },
        sRoleID: null,
        userGroups: [],
        onPressGo: 0
    }

    handleEmeaColumnChange = (value) => {
        this.setState({
            selectedEmeaColumns: value,
            emeaDefaultColumns: value
        })
    }

    handleApjColumnChange = (value) => {
        this.setState({
            selectedApjColumns: value,
            apjDefaultColumns: value
        })
    }

    setSelectedColumns = (columnsData) => {
        const emeaDefaultColumns = [];
        const apjDefaultColumns = [];
        const emeaChildren = [];
        const apjChildren = [];
        let emeaDisabled = true;
        let apjDisabled = true;
        columnsData.forEach((columnData) => {
            columnData.mapped_column.forEach((column) => {
                if (columnData.userGroup === "EMEA") {
                    emeaChildren.push(<Option key={column.dbcolumn} disabled={emeaDisabled}>{column.dbcoltxt}</Option>);
                    emeaDisabled = false;
                } else {
                    apjChildren.push(<Option key={column.dbcolumn} disabled={apjDisabled}>{column.dbcoltxt}</Option>);
                    apjDisabled = false;
                }
                if (column.visibility) {
                    if (columnData.userGroup === "EMEA") {
                        emeaDefaultColumns.push(column.dbcolumn);
                    } else {
                        apjDefaultColumns.push(column.dbcolumn);
                    }
                }
            });
        })
        this.setState({
            emeaDefaultColumns,
            apjDefaultColumns,
            emeaChildren,
            apjChildren,
            selectedEmeaColumns: emeaDefaultColumns,
            selectedApjColumns: apjDefaultColumns
        })
    }

    handleUserGroupChange = (value) => {
        this.setState({
            selectedUserGroup: value
        })
    }

    componentDidMount() {
        axios.get('/persona?sRoleID=2&jobRoleID=10')
            .then(response => {
                const tableColumns = this.getStructuredColumns(response.data.data);
                const cardMapping = this.createCardMapping(response.data.data[0].cards);
                this.setState({
                    adminData: response.data.data,
                    tableColumns,
                    cardMapping
                });
            })
            .catch(error => (console.log(error)))
        axios.get('/job/roles')
            .then(response => {
                const filteredRoles = [];
                response.data.data.forEach(role => {
                    if (role.jobRole !== 'Admin' && filteredRoles.indexOf(role.jobRole) === -1) {
                        filteredRoles.push(role.jobRole)
                    }
                })
                this.setState({
                    jobRoles: filteredRoles,
                    actualJobRoles: response.data.data
                });
            })
            .catch(error => (console.log(error)))
        if (this.props.userGroups.userGroups) {
            const filteredUserGroups = this.props.userGroups.userGroups.filter(userGroup => {
                return ['APJ', 'EMEA', 'AMS'].indexOf(userGroup.userGroupID) > -1
            })
            this.setState({
                sRoleID: this.props.userInfo.sRole.sRoleID,
                userGroups: filteredUserGroups
            })
        }
    }

    createCardMapping = (cardData) => {
        const cardDetails = {};
        cardData.forEach(card => {
            if (card.persID) {
                cardDetails[card.persID] = {
                    name: card.cardName,
                    id: card.cardID
                }
            }
        })
        return cardDetails;
    }

    handleGo = (persona, scope, userGroup) => {
        const jobRoleData = this.state.actualJobRoles.filter(role => {
            return role.jobRole === persona && role.position === scope
        })
        if (jobRoleData.length) {
            axios.get(`/persona?position=${scope}&jobRoleID=${jobRoleData[0].jobRoleID}&userGroup=${userGroup}`)
                .then(response => {
                    console.log("response",response)
                    const apiType = response.data.data.length ? 'PUT' : 'POST';
                    const selectedCards = [];
                    const personaData = cloneDeep(this.state.selectedPersonaData);
                    let tableData = [];
                    const onPressGo = this.state.onPressGo;
                    if (response.data.data.length) {
                        console.log("response.data.data[0]",response.data.data[0])
                        response.data.data[0].cards && response.data.data[0].cards.forEach(card => {
                            if (card.visibility) {
                                selectedCards.push(card)
                            }
                        })
                        tableData = response.data.data[0].table || [];
                        personaData.mapID = response.data.data[0].mapID;
                    }
                    personaData.table = tableData;
                    personaData.cards = selectedCards;
                    this.setState({
                        apiType,
                        userGroup,
                        persona,
                        scope,
                        onPressGo: onPressGo + 1,
                        selectedPersonaData: personaData,
                        jobRoleId: jobRoleData[0].jobRoleID
                    })
                }).catch(error => console.log(error))
        }
    }

    getStructuredColumns = (adminData) => {
        const mappedColumns = {};
        mappedColumns[constants.SKU] = [];
        Object.keys(constants).forEach(persId => {
            const skuTableData = adminData[0].table.filter(table => {
                return table.persID === constants[persId]
            })
            skuTableData.forEach(tableData => {
                tableData.mapped_column.forEach(column => {
                    if (!mappedColumns[constants[persId]]) {
                        mappedColumns[constants[persId]] = [];
                    }
                    mappedColumns[constants[persId]].push({
                        ...column,
                        ...{ dbtable: tableData.dbtable }
                    })
                })
            })
        })
        return mappedColumns;
    }

    handleSave = () => {
        const payload = this.getStructuredPayload();
        if (!payload.cards.length || !payload.table.length) {
            Modal.error({
                title: 'Please select at least one card and one table column',
            });
            return;
        }
        const unselectedCards = this.validateTableData(payload);
        if (unselectedCards.length) {
            Modal.error({
                title: 'Please select the below cards',
                content: unselectedCards.toString()
            });
            return
        }
        if (this.state.apiType === 'POST') {
            payload.tabs = [{
                "tab_name": "tab1",
                "visbility": true
            }];
            axios.post('/persona', payload)
                .then(response => {
                    showMessage('Added persona successfully', 'Success');
                    const existingPersonaData = cloneDeep(this.state.selectedPersonaData);
                    existingPersonaData.mapID = response.data.data.mapID;
                    this.setState({
                        apiType: 'PUT',
                        selectedPersonaData: existingPersonaData
                    })
                }).catch(error => {
                    console.log(error)
                })
        } else {
            axios.put('/persona', payload)
                .then(response => {
                    showMessage('Updated persona successfully', 'Success');
                }).catch(error => {
                    console.log(error)
                })
        }
    }

    validateTableData = (payload) => {
        const cards = [];
        const cardMapping = this.state.cardMapping;
        payload.table.forEach(tableData => {
            const isSelected = payload.cards.filter(card => {
                return card.cardID === cardMapping[tableData.persID].id
            })
            if (!isSelected.length) {
                cards.push(cardMapping[tableData.persID].name)
            }
        })
        return uniq(cards);
    }

    getStructuredPayload = () => {
        const { userGroup, scope, jobRoleId } = this.state;
        const { cards, mapID, table } = this.state.selectedPersonaData;
        const payload = {
            userGroup: userGroup,
            sRoleID: "1",
            jobRoleID: jobRoleId,
            position: scope,
            cards: cards,
            table
        }
        if (mapID) {
            payload.mapID = mapID;
        }
        return payload;
    }

    handleCardChange = (value, selectedCardData) => {
        const selectedCards = selectedCardData.map(card => {
            return {
                cardID: card.value,
                cardName: card.children,
                visibility: true
            }
        })
        const personaData = cloneDeep(this.state.selectedPersonaData);
        personaData.cards = selectedCards;
        this.setState({
            selectedPersonaData: personaData
        })
    }

    handleColumnChange = (selectedTableKey, selectedColumnsData) => {
        const personaData = cloneDeep(this.state.selectedPersonaData);
        const table = [];
        selectedColumnsData.forEach(column => {
            const tables = table.filter(tab => {
                return tab.dbtable === column.key.split('&')[1] && tab.persID === selectedTableKey
            })
            if (tables.length) {
                tables[0].mapped_column.push({
                    dbcoltxt: column.children,
                    dbcolumn: column.value,
                    visibility: true
                })
            } else {
                table.push({
                    dbtable: column.key.split('&')[1],
                    mapped_column: [{
                        dbcoltxt: column.children,
                        dbcolumn: column.value,
                        visibility: true
                    }],
                    persID: selectedTableKey,
                    visible: true
                })
            }
        })
        table.forEach(table => {
            remove(personaData.table, (tableData) => {
                return tableData.dbtable === table.dbtable && tableData.persID === table.persID
            })
            personaData.table.push(table)
        })
        this.setState({
            selectedPersonaData: personaData
        })
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'white' }}>
                <div style={{ padding: 20 }}>
                    <div style={{ margin: '20px 0' }}>
                        <ConfigHeader
                            handleGo={this.handleGo}
                            handleUserGroupChange={this.handleUserGroupChange}
                            jobRoles={this.state.jobRoles}
                            userGroups={this.state.userGroups} />
                    </div>
                    <ConfigTable
                        onPressGo={this.state.onPressGo}
                        selectedPersonaData={this.state.selectedPersonaData}
                        handleCardChange={this.handleCardChange}
                        handleColumnChange={this.handleColumnChange}
                        tableColumns={this.state.tableColumns}
                        adminData={this.state.adminData}
                        defaultColumns={this.state.selectedUserGroup === 'emea' ? this.state.emeaDefaultColumns : this.state.apjDefaultColumns}
                        children={this.state.selectedUserGroup === 'emea' ? this.state.emeaChildren : this.state.apjChildren} />
                </div>
                <div style={{ bottom: 0, position: 'fixed', width: '100%', display: 'flex', flexDirection: 'row-reverse', background: "black", height: 45, alignItems: 'center' }}>
                    <Button
                        type="primary"
                        style={{ marginRight: 10, width: 100 }}
                        onClick={this.handleSave}
                        disabled={!this.state.apiType}
                    >SAVE</Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userGroups: state.userGroups,
        userInfo: state.login.userInfo
    }
}

export default connect(mapStateToProps)(Configuration);