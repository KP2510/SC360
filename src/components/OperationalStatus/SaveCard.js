import React, { Component } from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Title } = Typography; 

class SaveCard extends Component {
    render() {
        return (
            <div>
                <Card
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: '15px',
                        backgroundSize: 'cover',
                        backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(./Laptop.jpg)'
                    }}
                    bodyStyle={{ padding: '5px', height: 'inherit' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        {/* <img src='./Tickmark.png' alt='saved'/> */}
                        <CheckCircleFilled style={{color: '#41b93f', fontSize: '50px'}}/>
                        <Title level={3} style={{color: 'white'}}>Saved</Title>
                    </div>
                </Card>
            </div>
        )
    }
}

export default SaveCard;
