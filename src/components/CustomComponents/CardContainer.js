import React from 'react'
//import Draggable from 'react-draggable';
import classes from './CardContainer.module.css';
//import { DragOutlined } from '@ant-design/icons'
import { Modal, Button } from 'antd';



const CardContainer = (props) => {
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setVisible(false);
            setLoading(false);
        }, 3000);
    };
    //console.log('props in Card:', props)


    const handleClick = (e) => {
        //console.log("e.target:", e.target)
        //console.log("e.target.id:", e.target.id)
        //const excludeClassName = e.target.parentNode.parentNode.className
        //return (e.target.id === "") ? setVisible(true) : null
        //console.log("Children", props.children)
    }

    return (
        // <Draggable
        //     bounds=".canvas"
        //     handle={`.${props.label}`}
        //     onDrag={props.handleElementDrag.bind(null, props.properties)}>
        <div>
            {/* <DragOutlined className={props.label}></DragOutlined> */}
            <div
                id={props.label}
                className={classes.CardContainer}
                style={{ 
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', 
                    padding: '10px', 
                    margin: '10px', 
                    overflow: 'hidden', 
                    backgroundColor: 'white', }}
                onClick={e => { handleClick(e) }}
            >{props.children}</div>
            <Modal
                visible={visible}
                title="Title"
                onOk={handleOk}
                onCancel={() => { setVisible(false) }}
                bodyStyle={{ height: "300px", overflowY: 'auto' }}
                width="80%"

                footer={[
                    <Button key="back" onClick={() => { setVisible(false) }}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}> Ok </Button>,
                ]}
            >
                <div onClick={(e) => { e.stopPropagation() }}>{props.children}</div>
            </Modal>
        </div>

        //</Draggable>
    )
}

export default CardContainer;