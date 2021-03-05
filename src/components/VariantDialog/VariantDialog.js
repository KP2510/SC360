import React from 'react';
import { Modal, Radio, Button, Input, Typography } from 'antd';
import { ValidationMessage } from '../../utils/helper';

const { Text } = Typography;
const VariantDialog = (props) => {
    const [disableSave, setDisableSave] = React.useState(true);
    const [errorState, setErrorState] = React.useState(false);
    const [sharing, setSharing] = React.useState("Public");
    const [message, setMessage] = React.useState();
    const [variantName, setVariantName] = React.useState('');
    React.useEffect(() => {
        setErrorState(false);
        setDisableSave(true);
        setVariantName('');
    }, [props.variantDialogState])

    const handleVariantInput = (event) => {
        const value = event.target.value;
        const message =  value.trim() === '' ? 'Variant name cannot be empty' : props.tablePersonalisationModel[value] ? 'Variant name already exists' : null;
        if (message) {
            setErrorState(true);
            setDisableSave(true);
        } else {
            setErrorState(false);
            setDisableSave(false);
        }
        setVariantName(value);
        setMessage(message);
    }

    const handleChange = (event) => {
        setSharing(event.target.value);
    };

    return (
        <Modal
            closable={false}
            title="Create Variant"
            visible={props.variantDialogState}
            zIndex={1200}
            footer={[
                <Button onClick={props.handleVariantDialogClose}>
                    Cancel
                 </Button>,
                <Button
                    onClick={() => { props.handleSaveAsVariant(sharing, variantName) }}
                    disabled={disableSave}
                    type="primary">
                    Save
                </Button>
            ]}
        >
            <p>Please provide a variant name</p>
            <div>
                <Input type='text' id='variantName' name='variantName' placeholder="Variant name"
                    value={variantName} onChange={handleVariantInput} />
                <ValidationMessage valid={!errorState} message={message} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                <Text strong>Sharing</Text>
                <Radio.Group onChange={handleChange} value={sharing}>
                    <Radio value="Public">Public</Radio>
                    <Radio value="Private">Private</Radio>
                </Radio.Group>
            </div>
        </Modal>
    )
}

export default VariantDialog;