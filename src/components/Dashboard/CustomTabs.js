import React from 'react';
import { Tabs } from 'antd';
import './CustomTabs.css';

const { TabPane } = Tabs;

const CustomTabs = ({ tabs,
    onChange,
    defaultTab,
    size = 'default' }) => {
    return (
        <div className="tabs-container">
            <Tabs defaultActiveKey={defaultTab} onChange={onChange} size={size}>
                {tabs && tabs.map(tab => <TabPane tab={tab.label} key={tab.value}>
                </TabPane>)}
            </Tabs>
        </div>
    )
};

export default CustomTabs;
