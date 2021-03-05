import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography } from 'antd';
import TitleRegionHeader from '../TitleRegionHeader';
import TableToolbar from '../TableToolbar';
import axios from '../../../utils/axios-instance';
import CustomTable from '../CustomTable';
import CustomTabs from '../CustomTabs';
import { constants } from '../../../shared/constant';

const { Title, Text } = Typography;

class BacklogReport extends Component {
    state = {
        tableData: [],
        userList: [],
        userGroupList: [],
        freezedColumns: ['partDetail1', 'partDetail2', 'partDetailn']
    }

    componentDidMount() {
        axios.get('supplychain/backlog')
            .then(response => {
                this.setState({
                    tableData: response.data
                })
            })
            .catch(error => console.log(error))
        axios.get(`/myPersona?userID=${this.props.userInfo.id}`)
            .then(response => {
                this.setState({
                    userList: response.data.data
                })
            })
            .catch(error => console.log(error))
        axios.get(`/userGroupPersona?userID=${this.props.userInfo.id}`)
            .then(response => {
                this.setState({
                    userGroupList: response.data.data
                })
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', padding: 10, background: 'white', margin: 10 }}>
                <TitleRegionHeader title='Backlog' visibility={{ shouldShowRegion: true, shouldShowSubRegion: true, shouldShowPeriod: true, shouldShowGroup: true, shouldShowFullscreen: true, shouldShowHide: true }}></TitleRegionHeader>
                <div style={{ display: 'flex', alignItems: 'baseline', margin: '20px 0 10px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                        <Title style={{ marginBottom: 0 }} level={3}>2,987</Title>
                        <Text>Backlog qty</Text>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                        <Title style={{ marginBottom: 0 }} level={3}>$89,354,985</Title>
                        <Text>Potential Revenue</Text>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Title style={{ marginBottom: 0 }} level={3}>$9,354,985</Title>
                        <Text>At Risk</Text>
                    </div>
                    <CustomTabs onChange={() => { }} tabs={[{ value: 'All', label: 'All' },
                    { value: 'CTO', label: 'CTO' },
                    { value: 'BTO', label: 'BTO' },
                    { value: 'BTS', label: 'BTS' }]} />
                </div>
                <TableToolbar
                    showProductBase={true}
                    showProductLine={true}
                    showPartNumber={true}
                    showRASLine={true}
                    showSupplier={true}
                    showDistributionCenter={true} />
                {this.state.tableData.data &&
                    <CustomTable data={this.state.tableData} users={this.state.userList} userGroup={this.state.userGroupList} tableType="child" cardType="big"
                        freezedColumns={this.state.freezedColumns} persID={constants.PERSID_BACKLOG} />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.login.userInfo,
    };
}

export default connect(mapStateToProps)(BacklogReport);
