import React from 'react';
import { Select, Input, Typography, Row, Col, Divider } from 'antd';
import { connect } from 'react-redux';

const { Option } = Select;
const { Title, Text } = Typography;

const FieldInput = ({ left, right }) => {
  return <><Row>
    <Col span={6}>
      {left}
    </Col>
    <Col span={12}>
      {right}
    </Col>
  </Row>  
    <br />
  </>
}

const UserForm = ({ isEditMode, userData, userGroups, jobRoles, systemRoles, setFormData, onSystemSelect, onJobRoleSelect, onUserGroupSelect }) => {
  console.log("jobRole",jobRoles)
  const { FirstName, LastName, userGroupID, sRoleID, jobRoleID, Email } = userData || {};
  const jobValue = jobRoles && jobRoles.find(item => item.value === (jobRoleID && jobRoleID.toString()));
  const systemValue = systemRoles && systemRoles.find(item => item.value === (sRoleID && sRoleID.toString()));
 console.log(systemValue,"systemValue")
 console.log(jobValue,"jobValue")
 return <div style={{ margin: 20 }}>
    <Title level={3}>Basic Details</Title>
    <br />
    <Row>
      <Col className="gutter-row" span={12}>
        <Title level={4}>Personal</Title>
        <br />
        <FieldInput left={<Text>First Name</Text>}
          right={isEditMode ? <Input placeholder="first name" name="FirstName" onChange={setFormData} value={FirstName || ''} /> : <Text>{FirstName}</Text>} />
        <FieldInput left={<Text>Last Name</Text>}
          right={isEditMode ? <Input placeholder="last name" name="LastName" onChange={setFormData} value={LastName || ''} /> : <Text>{LastName}</Text>} />
      </Col>
      <Col className="gutter-row" span={12}>
        <Title level={4}>Contact</Title>
        <br />
        <FieldInput left={<Text>Email Id</Text>}
          right={isEditMode ? <Input placeholder="email id" name="Email" onChange={setFormData} value={Email || ''} /> : <Text>{Email}</Text>} />
      </Col>
    </Row>
    <Divider />
    <Title level={3}>Roles</Title>
    <br />
    <Row>
      <Col className="gutter-row" span={12}>
        <FieldInput left={<Text>System Role</Text>}
          right={isEditMode ? <Select
            key="systemrole"
            labelInValue
            style={{ width: '100%' }}
            placeholder="Please select system role"
            value={systemValue}
            onChange={onSystemSelect}
          >
            {systemRoles && systemRoles.map(item => <Option key={item.value}>{item.label}</Option>)}
          </Select> : <Text>{systemValue && systemValue.label}</Text>} />
        <FieldInput left={<Text>Job Role</Text>}
          right={isEditMode ? <Select
            key="jobrole"
            labelInValue
            style={{ width: '100%' }}
            placeholder="Please select job roles"
            value={jobValue}
            onChange={onJobRoleSelect}
          >
            {jobRoles && jobRoles.map(item => <Option key={item.value}>{item.label}</Option>)}
          </Select> : <Text>{jobValue && jobValue.label}</Text>} />
      </Col>
    </Row>
    <Divider />
    <Title level={3}>User Groups:</Title>
    <br />
    <Row>
      <Col className="gutter-row" span={12}>
      <FieldInput left={<Text>User Groups</Text>}
          right={isEditMode ?
          <Select
            key="usergroups"
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select user groups"
            value={userGroupID}
            onChange={onUserGroupSelect}
          >
            {userGroups && userGroups.map(item => <Option key={item.userGroupID}>{item.userGroupID}</Option>)}
          </Select> : <Text>{userGroupID && userGroupID.join(', ')}</Text>} />
      </Col>
    </Row>
    <br />
  </div>
};

const mapStateToProps = (state) => {
  console.log(state.jobRoles,"saaaaaaaaaaaa")
  return {
    userGroups: state.userGroups && state.userGroups.userGroups,
    jobRoles: state.jobRoles && state.jobRoles.jobRoles,
    systemRoles: state.systemRoles && state.systemRoles.systemRoles
  }
}

export default connect(mapStateToProps)(UserForm);