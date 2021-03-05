import React, { Component } from 'react';
import { Typography, Popover, Button } from 'antd';
import { withCookies } from 'react-cookie';
import axiosInstance from '../../utils/axios-instance';
import CustomTabs from '../../components/Dashboard/CustomTabs';
import StackedColumnLine from '../../components/Charts/stackedColumnLine';
import {SettingFilled} from '@ant-design/icons';
import PDMenu from '../../components/Dashboard/PDMenu/PDMenu';
import { reactFormatter } from "react-tabulator";
import CustomTable from '../../components/Dashboard/CustomTable';

const { Text } = Typography;
const PDTabs = {
    All: 'pdAll',
    Demand: 'Demand',
    Orders: 'Orders',
    Backlog: 'Backlog',
    Shortages: 'Shortages',
    Inventory: 'Inventory',
    InQuarantine: 'In Quarantine',
    OpenPO: 'Open PO',
    Unbooked: 'Unbooked',
    Revenue: 'Revenue',
    Excess: 'Excess',
    Aging: 'Aging',
    Obsolescence: 'Obsolescence',
    History: 'History'
};

class ProductDashboard extends Component {
    state = {
        selectedTab: PDTabs.All,
        tableData: []
    }

    componentDidMount() {
        axiosInstance.get(`supplychain/${this.state.selectedTab}`)
            .then(response => {
                 response.data.mapped_column[0].formatter = reactFormatter(
                    <Popover placement="right" trigger="click" content={<PDMenu />}>
                        
                    </Popover>
                  )
                this.setState({
                    tableData: response.data
                })
            })
            .catch(error => console.log(error))
    }

    getTabContent = () => {
        switch (this.state.selectedTab) {
            case PDTabs.All:
            default:
                return this.state.tableData.data ? <CustomTable key='product' data={this.state.tableData} tableType="child" cardType="small"/> : null;

        }
    }
    render() {
        return (
            <div style={{ margin: 10 }}>
                {this.props.type === 'user' ? <>
                    <div style={{ display: 'flex', flexDirection: 'column', padding: 10, background: 'white' }}>
                        <div style={{ display: 'flex' }} >
                            <CustomTabs onChange={(value) => this.setState({ selectedTab: value })} tabs={Object.entries(PDTabs).map(item => { return { value: item[1], label: item[0] } })} defaultTab={this.state.selectedTab} />
                            <SettingFilled />
                        </div>
                        {this.getTabContent()}
                    </div>
                </>
                    : <>
                        <Text style={{ marginBottom: 10 }}>Planner Overview</Text>
                    </>
                }
            </div>
        )
    }
}

export default withCookies(ProductDashboard);