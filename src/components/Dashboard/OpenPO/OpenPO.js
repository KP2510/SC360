import React, { Component } from 'react';
import { Typography } from 'antd';
import TitleRegionHeader from '../TitleRegionHeader';
import TableToolbar from '../TableToolbar';
import axios from '../../../utils/axios-instance';
import CustomTabs from '../CustomTabs';
import CustomTable from '../CustomTable';
import { constants } from '../../../shared/constant';

const { Title, Text } = Typography;

class OpenPO extends Component {
    state = {
        tableData: [],
        freezedColumns: ['partDetail1', 'partDetail2', 'partDetailn']
    }

    componentDidMount() {
        axios.get(`supplychain/${constants.PERSID_OPENPO}`)
            .then(response => {
                this.setState({
                    tableData: response.data
                })
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', padding: 10, background: 'white', margin: 10 }}>
                <TitleRegionHeader title='Open PO' visibility={{ shouldShowRegion: true, shouldShowSubRegion: true, shouldShowPeriod: true, shouldShowGroup: true, shouldShowFullscreen: true, shouldShowHide: true }}></TitleRegionHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0 10px 0' }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Title style={{ marginBottom: 0 }} level={3}>013</Title>
                            <Text>POs</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Title style={{ marginBottom: 0 }} level={3}>$534,985</Title>
                            <Text>Potential Revenue</Text>
                        </div>
                    </div>
                    <CustomTabs onChange={() => { }} tabs={[{ value: 'Current Po', label: 'Current Po' }, { value: 'Past Due', label: 'Past Due' }]} />
                </div>
                <TableToolbar
                    showProductBase={true}
                    showProductLine={true}
                    showPartNumber={true}
                    showRASLine={true}
                    showSupplier={true}
                    showDistributionCenter={true}
                    showViews={true}
                    showSetting={true} />
                {this.state.tableData.data &&
                    <CustomTable data={this.state.tableData} tableType="child" cardType="big"
                        freezedColumns={this.state.freezedColumns} persID={constants.PERSID_OPENPO} />}
            </div>
        )
    }
}


export default OpenPO;
