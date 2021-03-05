import React from 'react';
import VariantManagementList from './VariantManagementList/VariantManagementList';
import { Typography, Button, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Title } = Typography

const variantManagement = (props) => {
    return (
        <div style={{
            'display': 'flex',
            'flexGrow': '1',
            'alignItems': 'center',
            'borderLeft': '2px solid white'
        }}>
            <Title
                color="inherit"
                level={3}
                style={{ marginBottom: 0 }}
                display="block">
                {props.selectedVariant}
            </Title>
            <VariantManagementList
                selectedVariantModel={props.selectedVariantModel}
                userID={props.userID}
                reset={props.reset}
                handleSaveVariant={props.handleSaveVariant}
                selectedDefaultVariant={props.selectedDefaultVariant}
                selectedVariant={props.selectedVariant.split('*')[0]}
                handleOpenVariantDialog={props.handleOpenVariantDialog}
                handleOpenManageDialog={props.handleOpenManageDialog}
                handleSelectVariant={props.handleSelectVariant}
                handleDeleteVariant={props.handleDeleteVariant}
                tablePersonalisationModel={props.tablePersonalisationModel}
                handleVariantClose={props.handleVariantClose}
                anchorEl={props.buttonAnchorEl}>
                <Tooltip title="Show Variants" placement="bottom">
                    <Button
                        type="ghost"
                        shape="circle"
                        style={{ border: 'none', boxShadow: 'none' }}
                        onClick={props.handleVariantOpen}
                        icon={<DownOutlined />} />
                </Tooltip>
            </VariantManagementList>
        </div>
    )
}

export default variantManagement;