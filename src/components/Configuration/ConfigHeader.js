import React, { useState } from 'react';
import { Select, Typography, Button, Checkbox } from 'antd';

const { Option } = Select;
const { Text } = Typography;

export default function ConfigHeader(props) {
    const [persona, setPersona] = useState("Supply Planner");
    const [scope, setScope] = useState("local");
    const [userGroup, setUserGroup] = useState("EMEA");
    return (
        <React.Fragment>
            <div style={{ display: 'flex', marginBottom: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px' }}>
                    <Text strong style={{ margin: '2px' }}>Persona:</Text>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a persona"
                        optionFilterProp="children"
                        value={persona}
                        onChange={(value) => { setPersona(value) }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {props.jobRoles.map(role => (
                            <Option key={role} value={role}>{role}</Option>
                        ))}
                    </Select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px' }}>
                    <Text strong style={{ margin: '2px' }}>Scope:</Text>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a scope"
                        optionFilterProp="children"
                        value={scope}
                        onChange={(value) => {
                            setScope(value)
                            if (value === 'global') {
                                setUserGroup('ww')
                            } else {
                                setUserGroup('EMEA')
                            }
                        }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        <Option key="local" value="local">Regional</Option>
                        <Option key="global" value="global">Global</Option>
                    </Select>
                </div>
                <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
                    <Text strong style={{ margin: '2px' }}>User Groups:</Text>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a view"
                        optionFilterProp="children"
                        value={userGroup}
                        onChange={(value) => { setUserGroup(value) }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {props.userGroups.map(userGroup => (
                            <Option key={userGroup.userGroupID} value={userGroup.userGroupID} disabled={scope === 'global'}>{userGroup.userGroupID}</Option>
                        ))}
                        <Option key={'ww'} value={'ww'} disabled={scope === 'local'}>WW</Option>
                    </Select>
                </div>
                <Button
                    type="primary"
                    onClick={props.handleGo.bind(this, persona, scope, userGroup)}
                    style={{ alignSelf: 'flex-end', margin: 10 }}>GO</Button>
            </div>
            <Checkbox disabled={scope === 'global'}>{`Apply same configuration to ${userGroup} ${scope === 'local' ? 'Global' : 'Local'} ${persona}`}</Checkbox>
        </React.Fragment>
    )
}