import React from 'react';
import { Tooltip, Button } from 'antd';

const IconButton = ({title, icon, onClick, style}) => {
    return <Tooltip title={title}>
        <Button type="primary" icon={icon} style={style} onClick={onClick}></Button>
    </Tooltip>
};

export default IconButton;