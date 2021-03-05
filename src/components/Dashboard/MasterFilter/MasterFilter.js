import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/index';
import { actionType } from '../../../shared/actionType';
import { Menu, Dropdown, Typography, message, Button } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MasterFilter = (props) => {
    const [selectProductLine, setSelectProductLine] = useState("ProductLine")
    const [selectRegion, setSelectRegion] = useState("Region")
    const [selectPlanner, setSelectPlanner] = useState("Planner")
    const [disabled, setDisabled] = useState(true);

    React.useEffect(() => {
        if (selectProductLine !== "ProductLine" || selectRegion !== "Region" || selectPlanner !== "Planner") {
            setDisabled(false)
        }
    }, [selectProductLine, selectRegion, selectPlanner])

    React.useEffect(() => {
        const { productLine, region, planner } = props.masterFilter
        if (productLine == "" && region == "" && planner == "") {
            setDisabled(true)
            setSelectProductLine("ProductLine")
            setSelectRegion("Region")
            setSelectPlanner("Planner")
        }
    }, [props.masterFilter])

    const productLine = (
        <Menu onClick={(e) => { setSelectProductLine(e.key) }}>
            <Menu.Item key="JERLSL">
                JERLSL
            </Menu.Item>
        </Menu>
    )

    const region = (
        <Menu onClick={(e) => { setSelectRegion(e.key) }}>
            <Menu.Item key="APJ">
                APJ
            </Menu.Item>
            <Menu.Item key="EMEA">
                EMEA
            </Menu.Item>
            <Menu.Item key="AMS">
                AMS
            </Menu.Item>
            <Menu.Item key="WW">
                WW
            </Menu.Item>
        </Menu>
    )

    const planner = (
        <Menu onClick={(e) => { setSelectPlanner(e.key) }}>
            <Menu.Item key="JERLSL">
                JERLSL
            </Menu.Item>
        </Menu>
    )

    const handleGo = () => {
        const payload = { productLine: selectProductLine, region: selectRegion, planner: selectPlanner }
        if (selectProductLine !== "ProductLine" || selectRegion !== "Region" || selectPlanner !== "Planner") {
            if (Object.keys(props.communication.selectedRowDetail).length) {
                props.addDropdownRequest(payload)
            } else {
                message.error('Please select a SKU to proceed');
            }
        } else {
            message.error('Please select a dropdown to proceed');
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <Text style={{ marginRight: 20, color: 'black' }}><FilterOutlined />FILTERS</Text>

                <Dropdown overlay={productLine} trigger={['click']}>
                    <Text style={{ cursor: 'pointer' }}> {selectProductLine}<DownOutlined style={{ marginRight: 20 }} /></Text>
                </Dropdown>
                <Dropdown overlay={region} trigger={['click']}>
                    <Text style={{ cursor: 'pointer' }}> {selectRegion}<DownOutlined style={{ marginRight: 20 }} /></Text>
                </Dropdown>
                <Dropdown overlay={planner} trigger={['click']}>
                    <Text style={{ cursor: 'pointer' }}> {selectPlanner}<DownOutlined style={{ marginRight: 20 }} /></Text>
                </Dropdown>
            </div>
            <Button onClick={handleGo}
                //disabled={disabled} 
                type="primary"> Go </Button>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        masterFilter: state.masterFilter,
        communication: state.communication,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addDropdownRequest: (payload) => dispatch(actions.addDropdownRequest(payload)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterFilter);