import React from 'react';
import { Typography, Select, Button, Dropdown, Menu } from 'antd';
import './TitleRegionHeader.css';
import { DownloadOutlined, LogoutOutlined, MenuOutlined, MoreOutlined, FullscreenOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <button style={{ background: 'none', border: 'none', outline: 'none' }}
        onClick={(checked, e) => { }}
      >Hide Card</button>
    </Menu.Item>
  </Menu>
);

const TitleRegionHeader = ({ title,
  visibility = {},
  regionChange,
  subRegionChange,
  plannerChange,
  periodChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ marginRight: '5px', color: 'black', fontSize: 18, fontWeight: 600 }}>{title.toUpperCase()}</Text>
      <div>
        <div>
          {/* {visibility.shouldShowRegion && <>
            <Select defaultValue="CTO" style={{ width: 100, borderRadius: '5px', marginLeft: 10 }}
              onChange={regionChange}
            >
              <Option value="CTO">CTO</Option>
              <Option value="APJ">APJ</Option>
              <Option value="EMEA">EMEA</Option>
            </Select>
          </>}
          {visibility.shouldShowSubRegion && <>
            <Select defaultValue="Non-Stock" style={{ width: 100, borderRadius: '5px', marginLeft: 10 }}
              onChange={subRegionChange}
            >
              <Option value="Non-Stock">Non-Stock</Option>
              <Option value="Stock">Stock</Option>
            </Select>
          </>}
          {visibility.shouldShowGroup && <>
            <Select defaultValue="AMS" style={{ width: 100, borderRadius: '5px', marginLeft: 10 }}
              onChange={plannerChange}
            >
              <Option value="AMS">AMS</Option>
              <Option value="APJ">APJ</Option>
              <Option value="EMEA">EMEA</Option>
            </Select>
          </>}
          {visibility.shouldShowPeriod && <>
            <Select defaultValue="FY20Q4W3" style={{ width: 100, borderRadius: '5px', marginLeft: 10 }}
              onChange={periodChange}
            >
              <Option value="FY20Q4W3">FY20Q4W3</Option>
              <Option value="FY20Q3W3">FY20Q3W3</Option>
              <Option value="FY20Q2W3">FY20Q2W3</Option>
            </Select>
          </>} */}
          {/* <Button style={{ marginLeft: 10}} icon={<DownloadOutlined />} /> */}
          {visibility.shouldShowFullscreen &&
            <Button style={{ marginLeft: 10 }} icon={<FullscreenOutlined />} />}
          {/* <Button style={{ marginLeft: 10 }} icon={<MenuOutlined />} /> */}
          {visibility.shouldShowHide &&
            <Dropdown
              overlay={menu}
              trigger={['hover']}
              placement="bottomRight">
              <MoreOutlined style={{ fontSize: 20 }} />
            </Dropdown>}
        </div>
      </div>
    </div>
  )
};

export default TitleRegionHeader;
