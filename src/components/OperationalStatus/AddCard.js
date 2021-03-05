import React, { Component } from 'react';
import axiosInstance from '../../utils/axios-instance';
import { Menu, Dropdown, Card, Typography, Rate, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { Text } = Typography;

class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: {
                geo: "",
                unitType: "",
                productLine: "",
                sku: ""
            },
            isFavourite: false
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
        this.setState({
            selectedValue: {
                ...this.state.selectedValue,
                [domEvent.target.type]: domEvent.target.innerText
            }
        })
        console.log('State:', this.state)
    };

    addNewCard = () => {
        //console.log('State', this.state)
        const { geo,unitType, productLine, sku} = this.state.selectedValue;
        const payload = {
            ...this.state.selectedValue,
            favourite: this.state.isFavourite
        }
        console.log('payload', payload)
        geo !== "" && unitType !== "" && productLine !== "" && sku !== "" ? (
            axiosInstance.post('/kpi', payload)
            .then( res => {
                console.log("Post Res::", res)
                alert('Successfully card created')
            }
            )
            .catch( error => {
                console.log("Error in Add Card:", error)
            })
        ) : (
            alert('Please select all dropdown')
        )

    }

    render() {
        //console.log('State:', this.state)
        return (
            <div>
                <Card
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: '12px',
                        backgroundColor: '#818181'
                    }}
                    bodyStyle={{ padding: '5px' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10%' }}>
                        <Text style={{
                            fontSize: 'small',
                            color: 'white',
                            marginTop: '10%'
                        }}>NEW KPI TILE</Text>
                        <div className='dropdown' style={{ margin: '5% 5% 0% 0%' }}>
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
                                                    <span style={{ color: 'orange' }}> {this.state.selectedValue[item[0]]}</span>
                                                </Text> <DownOutlined />
                                            </div>
                                        </Dropdown>
                                    );
                                })
                            }
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Text style={{ flexGrow: 1, color: 'white', fontSize: 'small' }}>FAVOURITE</Text>
                            <Rate
                                value={this.state.isFavourite}
                                count={1}
                                onChange={() => {
                                    this.setState({ isFavourite: !this.state.isFavourite })
                                }}
                                style={{ fontSize: '15px', marginRight: '3%' }} />
                        </div>

                        <hr style={{ width: '90%', margin: '5% 0% 2% 0%' }} />

                        <div className='footer' style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            
                            <Text style={{
                                fontSize: 'small',
                                color: 'white',
                                flexGrow: 1
                            }}>METRIC</Text>
                            <Button
                                type="default"
                                //icon={<CheckOutlined style={{fontSize: '5px'}}/>}
                                style={{height: '25%', fontSize: '10px', margin: '0% 10% 0% 0%'}}
                                onClick={this.addNewCard}
                            >Done</Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default AddCard
