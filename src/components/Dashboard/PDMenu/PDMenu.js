import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import TitleRegionHeader from '../TitleRegionHeader';
import TableToolbar from '../TableToolbar';
import Table from '../Table';
import Axios from 'axios';
import CustomTabs from '../CustomTabs';
import { DownOutlined, WarningFilled, ExclamationCircleFilled, ExclamationOutlined, DollarOutlined, UpOutlined, TagFilled, CommentOutlined, FlagFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const GroupKey = {
    AMS: 'AMS', APJ: 'APJ', EMEA: 'EMEA', Global: 'Global'
}

export default class PDMenu extends Component {
    state = {
        selectedTab: GroupKey.AMS
    }

    componentDidMount() {
    }

    getTabContent = () => {
        switch (this.state.selectedTab) {
            case GroupKey.AMS:
                return <div style={{ display: 'flex', justifyContent: 'row', marginTop: 10 }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>1200 </Text>
                            <Text style={{ fontSize: 11 }}>Demand Plan of Record</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>2000 </Text>
                            <Text style={{ fontSize: 11 }}>Demand Plan</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>1289 </Text>
                            <Text style={{ fontSize: 11 }}>Open Deals</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>1289 </Text>
                            <Text style={{ fontSize: 11 }}>Open Deals</Text>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>1200 </Text>
                            <Text style={{ fontSize: 11 }}>Demand Plan</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>2000 </Text>
                            <Text style={{ fontSize: 11 }}>Demand Plan</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>1289 </Text>
                            <Text style={{ fontSize: 11 }}>Open Deals</Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 12, fontWeight: 800 }}>1289 </Text>
                            <Text style={{ fontSize: 11 }}>Open Deals</Text>
                        </div>
                    </div>
                </div>;
            case GroupKey.APJ:
            case GroupKey.EMEA:
            case GroupKey.Global:
            default: return null;
        }
    }
    render() {
        return (
            <div style={{ display: 'flex', width: 300, flexDirection: 'row', padding: 10, background: 'white'}}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <Button icon={<TagFilled />} />
                        <Button icon={<ExclamationOutlined />} />
                        <Button icon={<DollarOutlined />} />
                        <Button icon={<UpOutlined />} />
                    </div>
                    <div>
                        <Button icon={<WarningFilled />} />
                        <Button icon={<CommentOutlined />} />
                        <Button icon={<FlagFilled />} />
                        <Button icon={<DownOutlined />} />
                    </div>
                </div>
                <div style={{ marginLeft: 10 }}>
                    <CustomTabs onChange={(value) => { this.setState({selectedTab: value})}} tabs={['AMS', 'APJ', 'EMEA', 'Global'].map(item => { return { value: item, label: item } })} />
                    {this.getTabContent()}
                </div>
            </div>
        )
    }
}
