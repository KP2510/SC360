import React, { Component } from 'react';
import Moment from 'react-moment';
import { Card, Typography } from 'antd';
import { MoreOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import './GenericCard.css';
const { Text, Title } = Typography;

const DownArrow = () => {
    return (
        <svg x="0px" y="0px"
            viewBox="0 0 511.987 511.987">
            <path d="M387.098,227.115l-77.781,77.803V53.333C309.316,23.878,285.438,0,255.983,0
	S202.65,23.878,202.65,53.333v251.584l-77.781-77.803c-21.838-21.838-57.245-21.838-79.083,0s-21.838,57.245,0,79.083
	l202.667,202.667c4.165,4.164,10.917,4.164,15.083,0l202.667-202.667c21.838-21.838,21.838-57.245,0-79.083s-57.245-21.838-79.083,0
	L387.098,227.115z"/>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
        </svg>
    )
}
const UpArrow = () => (
    <svg x="0px" y="0px" viewBox="0 0 512.008 512.008">
        <path d="M263.556,3.123c-4.165-4.164-10.917-4.164-15.083,0L45.807,205.79
	c-21.838,21.838-21.838,57.245,0,79.083s57.245,21.838,79.083,0l77.781-77.781v251.584c0,29.455,23.878,53.333,53.333,53.333
	c29.455,0,53.333-23.878,53.333-53.333V207.091l77.781,77.781c21.838,21.838,57.245,21.838,79.083,0s21.838-57.245,0-79.083
	L263.556,3.123z"/>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
    </svg>
)
const DownArrowIcon = props => <Icon component={DownArrow} {...props} />;
const UpArrowIcon = props => <Icon component={UpArrow} {...props} />;

class GenericCard extends Component {

    render() {
        return (
            <div>
                <Card
                    style={{
                        width: 200,
                        height: 150,
                        borderRadius: '12px',
                        backgroundSize: 'cover',
                        backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(./building.jpeg)'
                    }}
                    bodyStyle={{ padding: '5px' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', margin: '3%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 'small', color: 'white' }}>{this.props.kpiData.title}</Text>
                            <div>
                                <EditFilled className='hover-visible' style={{ color: 'white', fontSize: 15, padding: 3 }} />
                                <DeleteFilled className='hover-visible' style={{ color: 'white', fontSize: 15, padding: 3 }} />
                            </div>
                        </div>
                        <Text style={{
                            fontSize: 'small',
                            color: 'white'
                        }}>{this.props.kpiData.subtitle}</Text>
                        <Title level={4} style={{ color: 'white', marginBottom: 0, marginTop: '9%' }}>{`$${this.props.kpiData.amount}`}</Title>
                        <div>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{`${this.props.kpiData.percentage}%`}</Text>
                            {this.props.kpiData.indicator === 'High' ? <UpArrowIcon style={{ fill: '#66FF00', width: 12, marginLeft: 10 }} /> : <DownArrowIcon style={{ fill: 'red', width: 12, marginLeft: 10 }} />}
                        </div>
                        <Text style={{ color: 'white' }}>
                            <span>Latest: </span>
                            <Moment format="hh:mmA DD-MM-YY">
                                {this.props.kpiData.latest}
                            </Moment>
                        </Text>
                    </div>
                </Card>
            </div>
        )
    }
}

export default GenericCard;
