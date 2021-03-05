import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Popover } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import './VariantManagementList.css';

export default function VariantManagementList(props) {
    const [visible, setVisible] = useState(Boolean(props.anchorEl));
    useEffect(() => {
        setVisible(Boolean(props.anchorEl))
    }, [props.anchorEl])
    const handleDeleteVariant = (key) => {
        Modal.confirm({
            title: 'Are you sure you want to delete the variant?',
            onOk() {
                props.handleDeleteVariant(key)
            },
            zIndex: 1400
        });
    }

    const handleVisibleChange = (visible) => {
        setVisible(visible)
    }
    const variantList = (
        <div style={{
            display: 'flex',
            height: '100%',
            width: '300px',
            flexDirection: 'column'
        }}>
            <div style={{ flex: '1 0 auto', height: '300px', overflowY: 'scroll' }}>
                <List
                    size="small"
                    dataSource={Object.keys(props.tablePersonalisationModel)}
                    renderItem={
                        item => (
                            <List.Item key={item} onClick={props.handleSelectVariant} className="ListItem">
                                <List.Item.Meta
                                    title={item}
                                />
                                <div>
                                    <Button
                                        ghost={true}
                                        danger
                                        shape="circle"
                                        disabled={item.toLowerCase() === 'standard'}
                                        onClick={handleDeleteVariant.bind(null, item)}
                                        icon={<DeleteFilled />} />
                                </div>
                            </List.Item>
                        )
                    }
                />
            </div>
            <footer style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
                <Button
                    style={{ marginRight: 10 }}
                    type="primary"
                    disabled={props.reset || props.selectedVariant === props.selectedDefaultVariant || (props.selectedVariantModel ? parseInt(props.userID) !== parseInt(props.selectedVariantModel.createdBy) : false)}
                    onClick={props.handleSaveVariant}>
                    Save
                </Button>
                <Button
                    style={{ marginRight: 10 }}
                    type="primary"
                    disabled={props.reset}
                    onClick={props.handleOpenVariantDialog}>
                    Save As
                </Button>
                <Button
                    type="primary"
                    onClick={props.handleOpenManageDialog}>
                    Manage
                </Button>
            </footer>
        </div>
    )

    return (
        <Popover
            overlayClassName="VariantManagementContent"
            content={variantList}
            title='Variant List'
            trigger="click"
            visible={visible}
            placement="right"
            onVisibleChange={handleVisibleChange}
        >
            {props.children}
        </Popover>
    )
}