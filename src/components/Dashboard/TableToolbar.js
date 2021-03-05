import React from 'react';
import { Menu, Dropdown, Typography, Button } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const productBase = (
    <Menu>
        <Menu.Item key="0">
            JSH123
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
            JDD135
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
);

const productLine = (
    <Menu>
        <Menu.Item key="0">
            JERLSL
        </Menu.Item>
    </Menu>
)

const partNumber = (
    <Menu>
        <Menu.Item key="0">
            JERLSL
        </Menu.Item>
    </Menu>
)

const rasLine = (
    <Menu>
        <Menu.Item key="0">
            JERLSL
        </Menu.Item>
    </Menu>
)

const supplier = (
    <Menu>
        <Menu.Item key="0">
            JERLSL
        </Menu.Item>
    </Menu>
)

const distributionCenter = (
    <Menu>
        <Menu.Item key="0">
            JERLSL
        </Menu.Item>
    </Menu>
)
export default function TableToolbar({
    showProductBase = false,
    showProductLine = false,
    showPartNumber = false,
    showRASLine = false,
    showSupplier = false,
    showDistributionCenter = false
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0px 0px 10px 0px' }}>
            <div>
                <FilterOutlined style={{ marginRight: 20, color: 'black' }} />
                {showProductBase && <Dropdown overlay={productBase} trigger={['click']}>
                    <Text>
                        Product Base (15) <DownOutlined style={{ marginRight: 20 }} />
                    </Text>
                </Dropdown>}
                {showProductLine && <Dropdown overlay={productLine} trigger={['click']}>
                    <Text>
                        Product Line <DownOutlined style={{ marginRight: 20 }} />
                    </Text>
                </Dropdown>}
                {showPartNumber && <Dropdown overlay={partNumber} trigger={['click']}>
                    <Text>
                        Part Number (50) <DownOutlined style={{ marginRight: 20 }} />
                    </Text>
                </Dropdown>}
                {showRASLine && <Dropdown overlay={rasLine} trigger={['click']}>
                    <Text>
                        RAS Line <DownOutlined style={{ marginRight: 20 }} />
                    </Text>
                </Dropdown>}
                {showSupplier && <Dropdown overlay={supplier} trigger={['click']}>
                    <Text>
                        Supplier (5) <DownOutlined style={{ marginRight: 20 }} />
                    </Text>
                </Dropdown>}
                {showDistributionCenter && <Dropdown overlay={distributionCenter} trigger={['click']}>
                    <Text>
                        Distribution Center <DownOutlined style={{ marginRight: 20, flexGrow: 1 }} />
                    </Text>
                </Dropdown>}
            </div>
            <div><Button type="primary"> Go </Button></div>
        </div>
    )
}
