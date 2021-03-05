import React from 'react';
import { Table, Select, Radio, Modal, Button } from 'antd';
import { cloneDeep } from 'lodash';

const { Option } = Select;

export default function ManageDialog(props) {
    const [selectedDefaultValue, setDefaultVariant] = React.useState();
    const [variantManagementModel, setVariantManagementModel] = React.useState(props.manageVariantList);
    const [updatedManagementModel, setUpdatedManagementModel] = React.useState({});

    React.useEffect(() => {
        setDefaultVariant(props.selectedDefaultVariant);
        setVariantManagementModel(props.manageVariantList);
    }, [props.selectedDefaultVariant, props.manageDialogState, props.manageVariantList])

    const handleShareChange = (variant, value) => {
        const model = cloneDeep(variantManagementModel);
        const updatedModel = cloneDeep(updatedManagementModel);
        if (model[variant]) {
            model[variant].visibility = value;
            model[variant].visibleToUsers = [];
            model[variant].visibleToUsersGroup = [];
            updatedModel[variant] = model[variant];
            setVariantManagementModel(model);
            setUpdatedManagementModel(updatedModel);
        }
    }

    const handleUserChange = (variant, value) => {
        const model = cloneDeep(variantManagementModel);
        const updatedModel = cloneDeep(updatedManagementModel);
        if (model[variant]) {
            model[variant].visibleToUsers = value;
            updatedModel[variant] = model[variant];
            setVariantManagementModel(model);
            setUpdatedManagementModel(updatedModel);
        }
    }

    const handleUserGroupChange = (variant, value) => {
        const model = cloneDeep(variantManagementModel);
        const updatedModel = cloneDeep(updatedManagementModel);
        if (model[variant]) {
            model[variant].visibleToUsersGroup = value;
            updatedModel[variant] = model[variant];
            setVariantManagementModel(model);
            setUpdatedManagementModel(updatedModel);
        }
    }

    const handleDefaultChange = (event) => {
        const variant = event.target.value;
        const model = cloneDeep(variantManagementModel);
        const updatedModel = cloneDeep(updatedManagementModel);
        if (model[variant]) {
            updatedModel[variant] = model[variant];
            setUpdatedManagementModel(updatedModel);
            setDefaultVariant(variant);
        }
    };

    const dataSource = [];
    Object.keys(variantManagementModel).forEach((variant) => {
        dataSource.push({
            key: variant,
            view: variant,
            sharing: { value: variantManagementModel[variant].visibility, variant, createdBy: variantManagementModel[variant].createdBy },
            user: { users: props.users, visibility: variantManagementModel[variant].visibility, selectedUsers: variantManagementModel[variant].visibleToUsers, variant, createdBy: variantManagementModel[variant].createdBy },
            userGroup: { userGroups: props.userGroup, visibility: variantManagementModel[variant].visibility, selectedUserGroups: variantManagementModel[variant].visibleToUsersGroup, variant, createdBy: variantManagementModel[variant].createdBy },
            default: { checked: selectedDefaultValue === variant, variant },
            createdByName: variantManagementModel[variant].createdByName
        })
    })

    const columns = [
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view'
        },
        {
            title: 'Sharing',
            dataIndex: 'sharing',
            key: 'sharing',
            render: sharedType => (
                <Select
                    value={sharedType.value}
                    style={{ width: 120 }}
                    disabled={sharedType.createdBy !== parseInt(props.userID) || sharedType.variant.toLowerCase() === 'standard'}
                    onChange={handleShareChange.bind(this, sharedType.variant)}>
                    <Option value="Private">Private</Option>
                    <Option value="Public">Public</Option>
                </Select>
            )
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: userList => (
                <Select
                    mode="multiple"
                    style={{ width: '200px' }}
                    placeholder="Please select users"
                    dropdownMatchSelectWidth={false}
                    maxTagCount={1}
                    maxTagTextLength={8}
                    showArrow={true}
                    value={userList.selectedUsers}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={userList.visibility === 'Public' || userList.createdBy !== parseInt(props.userID)}
                    onChange={handleUserChange.bind(this, userList.variant)}
                >
                    {userList.users.map(user => (
                        <Option key={user.userID} value={user.userID}>{`${user.FirstName} ${user.LastName}`}</Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'User Group',
            dataIndex: 'userGroup',
            key: 'userGroup',
            render: userGroupList => (
                <Select
                    mode="multiple"
                    style={{ width: '200px' }}
                    placeholder="Please select user groups"
                    dropdownMatchSelectWidth={false}
                    maxTagCount={1}
                    maxTagTextLength={8}
                    showArrow={true}
                    value={userGroupList.selectedUserGroups}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={userGroupList.visibility === 'Public' || userGroupList.createdBy !== parseInt(props.userID)}
                    onChange={handleUserGroupChange.bind(this, userGroupList.variant)}
                >
                    {userGroupList.userGroups.map(userGroup => (
                        <Option key={userGroup} value={userGroup}>{userGroup}</Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'Default',
            dataIndex: 'default',
            width: '150px',
            key: 'default',
            render: (defaultValue) => (
                <Radio
                    checked={defaultValue.checked}
                    value={defaultValue.variant}
                    onChange={handleDefaultChange}
                />
            )
        },
        {
            title: 'Created By',
            dataIndex: 'createdByName',
            width: '150px',
            key: 'createdByName',
        }
    ];

    return (
        <Modal
            title="Manage Variants"
            width={1200}
            visible={props.manageDialogState}
            onCancel={props.handleCloseManageDialog}
            footer={[
                <Button onClick={props.handleCloseManageDialog} color="primary">
                    Cancel
                </Button>,
                <Button onClick={props.handleApplyManageDialog.bind(null, selectedDefaultValue, updatedManagementModel)} color="primary" autoFocus>
                    Apply
                </Button>
            ]}
        >
            <Table tableLayout={'auto'} dataSource={dataSource} columns={columns} scroll={{ y: 240 }} pagination={false} />
        </Modal>
    );
}