import React, { useState } from 'react';
import { List, Button, Input, Select } from 'antd';
import { connect } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

const UserGroupForm = ({ users, userGroups, data, addUser, removeUser, isEditMode, addUserGroup }) => {
  const [searchValue, setSearchValue] = useState((data && data.userID) || []);
  const [userGroupName, setUserGroupName] = useState('');
  const group = userGroups.find(group => data && group.userGroupID === data.userGroupID);
  const groupUsers = group && group.users;
  const newusers = users && users.filter(user => {
    return !groupUsers || !groupUsers.find(item => item.userID === user.userID);
  });
  const filteredUser = newusers && newusers.map(user => { 
    const name = user.FirstName + ' ' + user.LastName; 
    return { ...user, value: user.userID, label: name } 
  });

  return <div style={{ margin: 20 }}>
    {(!data || !data.userGroupID) &&
      <div>
        <Input placeholder="Enter user group name" style={{marginBottom: 20}} name="FirstName" onChange={(e) => setUserGroupName(e.target.value)} value={userGroupName} />
        {userGroupName && <Button type="primary" style={{marginBottom: 20}} onClick={() => addUserGroup(userGroupName)} >Add User Group</Button>}
      </div>}
    <div>
      {(!data || !data.userGroupID || isEditMode) &&
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Select
            key="systemrole"
            mode="multiple"
            labelInValue
            style={{ width: '100%' }}
            placeholder="Add user"
            value={searchValue}
            onChange={(value) => { setSearchValue(value); addUser(value.map(item => parseInt(item.value))); }}
          >
            {filteredUser && filteredUser.map(item => <Option key={item.value}>{item.label}</Option>)}
          </Select>
        </div>}
      {data && data.userGroupID &&
        <List
          dataSource={groupUsers || []}
          renderItem={item => (
            <List.Item style={{ backgroundColor: 'white' }}>
              <div style={{ marginLeft: 20 }}>
                {item.FirstName + ' ' + item.LastName}
              </div>
              {isEditMode && <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => removeUser(item)}></Button>}
            </List.Item>)}
        />}
    </div>
  </div>;
};


const mapStateToProps = (state) => {
  return {
    users: state.users && state.users.users,
    userGroups: state.userGroups && state.userGroups.userGroups
  }
}

export default connect(mapStateToProps)(UserGroupForm);
