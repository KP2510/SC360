import React from 'react'
import { Card, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getValidRoles } from '../../utils/helper'

const CardView = ({ coverImage, userInfo, title, chart }) => {
    const handleClick = () => {
        console.log("clicked")
        window.open("https://app.powerbi.com/", "_blank")
    }
    const { isPlanner } = getValidRoles(userInfo);
    const { Meta } = Card;
    return (
        <div className="Card" style={{ marginBottom: '20px' }} onClick={handleClick}>
            <Card
                style={{ width: 300, boxShadow: '2px 2px 12px 2px #8c8585' }}
                cover={
                    <div style={{
                        width: '300px',
                        height: '200px'
                    }}>{chart || <img
                        alt="example"
                        style={{
                            width: '300px',
                            height: '200px'
                        }}
                        src={coverImage || "./supplyChain.jpg"}
                    />}</div>
                }
                actions={isPlanner ? [<EllipsisOutlined key="ellipsis" />] : [
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    avatar={<Avatar src="./brilliologo.png" />}
                    title={title}
                    description="www.powerbi.com/report"
                    style={{height: '65px' }}
                />
            </Card>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.login.userInfo
    };
}

export default connect(mapStateToProps)(CardView);