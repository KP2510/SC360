import React, { Component } from 'react';
import axiosInstance from '../../utils/axios-instance';
import { Card, Typography } from 'antd';
import { Menu, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

class EditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: {
                geo: "EMEA",
                unitType: "Product Family",
                productLine: "Global",
                sku: "SKU"
            }
        };
    }


    layoutMenu = (data) => {
        //console.log("DATA:", data)
        return (
            <Menu onClick={this.onClick}>
                {
                    data[1].map(subMenu => {
                        //console.log("subMenu:", data[0])
                        return (<Menu.Item key={subMenu.key} type={data[0]}>{subMenu.value}</Menu.Item>);
                    })
                } </Menu>
        );
    }

    onClick = ({ key, domEvent }) => {
        // console.log('key:', key)
        // console.log('domEvent type:', domEvent.target.type)
        // console.log('domEvent innerText:', domEvent.target.innerText)
        this.setState({
            selectedValue: {
                ...this.state.selectedValue,
                [domEvent.target.type]: domEvent.target.innerText
            }
        })
    };



    render() {
        //console.log("state::", this.state)
        //console.log("props in EC::", this.props)
        return (
            <div>
                <Card
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: '12px',
                        backgroundSize: 'cover',
                        backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(./building.jpeg)'
                    }}
                    bodyStyle={{ padding: '5px' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10%' }}>
                        <Text style={{
                            fontSize: 'small',
                            color: 'white',
                            marginTop: '10%'
                        }}>EDIT TILE</Text>
                        <div className='dropdown' style={{ margin: '10% 5% 15% 0%' }}>
                            {
                                Object.entries(this.props.data).map(item => {
                                    return (
                                        <Dropdown
                                            key={item[0]}
                                            overlay={this.layoutMenu(item)}
                                            trigger={['click']}>
                                            <div className="ant-dropdown-link" style={{
                                                fontSize: 'small',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }} onClick={e => e.preventDefault()}>
                                                <Text style={{ flexGrow: 1, color: 'white' }}>
                                                    {item[0].toUpperCase()}
                                                    <span style={{ color: 'orange' }}> {this.props.selectedValue[item[0]]}</span>
                                                </Text> <DownOutlined />
                                            </div>
                                        </Dropdown>
                                    );
                                })
                            }
                        </div>
                        <div className='footer'>
                            <hr style={{ width: '90%' }} />
                            <Text style={{
                                fontSize: 'small',
                                color: 'white'
                            }}>METRIC</Text>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default EditCard