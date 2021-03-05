import React, { Component } from 'react';
import { Dropdown, List, Menu, Layout, Button, Input, Typography, Modal, Tooltip } from 'antd';
import { DownOutlined, EditOutlined, SaveOutlined, CloseSquareOutlined } from '@ant-design/icons';
import './UserConfiguration.css';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import UserForm from '../../components/UserConfiguration/UserForm';
import UserGroupForm from '../../components/UserConfiguration/UserGroupForm';
import { DeleteOutlined } from '@ant-design/icons';
import IconButton from '../../components/UI/IconButton/IconButton';

const { Title } = Typography;
const { Search } = Input;
const { Content, Sider, Footer } = Layout;

const MenuKey = {
  Users: 'Users',
  UserGroup: 'User Group',
  Roles: 'Roles'
}
const SIDER_WIDTH = 300;

class UserConfiguration extends Component {
  constructor(props) {
    super(props);

    const { users, userGroups, systemRoles } = this.props;

    this.state = {
      selectedMenu: MenuKey.Users,
      data: null,
      isEdit: false,
      filterText: '',
      selectedUser: users && users.length > 0 && { ...users[0], sRoleID: users[0].sRoleID, jobRoleID: users[0].jobRoleID },
      selectedUserGroup: userGroups && userGroups.length > 0 && { ...userGroups[0] },
      selectedSystemRole: systemRoles && systemRoles.length > 0 && { ...systemRoles[0] }
    }
  }

  componentDidMount() {
    this.props.getJobRoles();
    this.props.getSystemRoles();
  }

  componentDidUpdate(prevProps) {
    const { users, userGroups, systemRoles } = this.props || {};
    const { selectedMenu, selectedUser, selectedUserGroup, selectedSystemRole } = this.state;

    if (selectedMenu === MenuKey.Users && prevProps.users !== users && users && users.length > 0 && !selectedUser) {
      const user = users[0];
      this.setState({ selectedUser: { ...user, sRoleID: user.sRoleID, jobRoleID: user.jobRoleID } })
    } else if (selectedMenu === MenuKey.UserGroup && prevProps.userGroups !== userGroups && userGroups && userGroups.length > 0 && !selectedUserGroup) {
      const userGroup = userGroups[0];
      this.setState({ selectedUserGroup: { ...userGroup } })
    } else if (selectedMenu === MenuKey.Roles && prevProps.systemRoles !== systemRoles && systemRoles && systemRoles.length > 0 && !selectedSystemRole) {
      const systemRole = systemRoles[0];
      this.setState({ selectedSystemRole: { ...systemRole } })
    }
  }

  getListDataForMenu = () => {
    const { selectedMenu, filterText } = this.state;
    const { users, userGroups, systemRoles } = this.props || {};
    const filter = filterText.toLowerCase();

    switch (selectedMenu) {
      case MenuKey.UserGroup:
        return filterText ? userGroups.filter(item => item.userGroupID.toLowerCase().includes(filter)) : userGroups;
      case MenuKey.Roles:
        return filterText ? systemRoles.filter(item => item.sRole.toLowerCase().includes(filter)) : systemRoles;
        case MenuKey.Users:
      default:
        return filterText ? users && users.filter(item => item.FirstName.toLowerCase().includes(filter)) : users;
    }
  }

  handleMenuClick = ({ key }) => {
    this.setState({ selectedMenu: key, filterText: '', isEdit: false });

    switch (key) {
      case MenuKey.UserGroup:
        this.props.getUserGroups();
        break;
      case MenuKey.Roles:
        this.props.getSystemRoles();
        break;
      case MenuKey.Users:
        this.props.getUsers();
        break;
      default:
        return;
    }
  };

  onAddNewButtonClick = () => {
    switch (this.state.selectedMenu) {
      case MenuKey.UserGroup:
        this.setState({ selectedUserGroup: null, isEdit: false })
        break;
      case MenuKey.Roles:
        this.setState({ selectedSystemRole: null, isEdit: true })
        break;
      case MenuKey.Users:
        this.setState({ selectedUser: null, isEdit: true })
        break;
      default:
        return;
    }
  };

  onDeleteUserClick = () => {
    switch (this.state.selectedMenu) {
      case MenuKey.UserGroup:
        Modal.confirm({
          title: 'Are you sure you want to delete user group?',
          onOk: () => {
            this.props.deleteUserGroup(this.state.selectedUserGroup.userGroupID);
            this.setState({ selectedUserGroup: null, isEdit: false })
          },
          zIndex: 1400
        })
        break;
      case MenuKey.Roles:
        break;
      case MenuKey.Users:
        Modal.confirm({
          title: 'Are you sure you want to delete user?',
          onOk: () => {
            this.props.deleteUser(this.state.selectedUser.userID);
            this.setState({ selectedUser: null, isEdit: false })
          },
          zIndex: 1400
        })
        break;
      default:
        return;
    }
  }

  userGroupSelect = (value) => {
    this.setState({ selectedUser: { ...this.state.selectedUser, userGroupID: value } })
  }

  systemRoleSelect = (value) => {
    this.setState({ selectedUser: { ...this.state.selectedUser, sRoleID: value.value } })
  }

  jobRoleSelect = (value) => {
    this.setState({ selectedUser: { ...this.state.selectedUser, jobRoleID: value.value } })
  }

  personaListSelect = (value) => {
    this.setState({ selectedUser: { ...this.state.selectedUser, persona: value.value } })
  }

  renderForm = () => {
    const { selectedMenu, selectedUser, selectedUserGroup, selectedSystemRole, isEdit } = this.state;

    switch (selectedMenu) {
      case MenuKey.UserGroup:
        return <UserGroupForm data={selectedUserGroup} isEditMode={isEdit} addUser={(value) => {
          this.setState({ selectedUserGroup: { ...this.state.selectedUserGroup, userID: value } })
        }} removeUser={(user) => {
          Modal.confirm({
            title: 'Are you sure you want to remove user from this group?',
            onOk: () => {
              this.props.removeUserFromUserGroup({
                userID: user.userID,
                userGroupID: selectedUserGroup.userGroupID
              }, user)
            },
            zIndex: 1400
          })
        }} addUserGroup={(name) => {
          if (!this.state.selectedUserGroup || this.state.selectedUserGroup.userID.length === 0) {
            this.displayFailure('Please select atleast one user');
            return;
          }
          this.props.createUserGroup({ userGroupID: name, userID: this.state.selectedUserGroup.userID }, () => this.setState({ selectedUserGroup: { userGroupID: name } }))
        }} />
      case MenuKey.Roles:
        return null;
      case MenuKey.Users:
      default:
        return <UserForm
          isEditMode={isEdit}
          userData={selectedUser}
          onJobRoleSelect={this.jobRoleSelect}
          onSystemSelect={this.systemRoleSelect}
          onUserGroupSelect={this.userGroupSelect}
          setFormData={this.setUserFormData} />;
    }
  }

  setUserFormData = (e) => {
    this.setState({ selectedUser: { ...this.state.selectedUser, [e.target.name]: e.target.value } })
  }

  saveData = () => {
    const { selectedUser, selectedMenu, selectedUserGroup } = this.state;

    if (selectedMenu === MenuKey.Users) {
      const userData = {
        pushNotf: selectedUser.pushNotf,
        userID: selectedUser.userID,
        emailNotf: selectedUser.emailNotf,
        sRoleID: selectedUser.sRoleID,
        FirstName: selectedUser.FirstName,
        LastName: selectedUser.LastName,
        jobRoleID: selectedUser.jobRoleID,
        userGroupID: selectedUser.userGroupID,
        Email: selectedUser.Email,
      };

      if (userData.userID) {
        this.props.updateUser({ ...userData, updatedAt: new Date() }, () => {
          this.displaySuccess('Updated successfully')
          this.setState({ ...this.state, isEdit: false })
        }, () => {
          this.displayFailure('Failed updating')
        });
      } else {
        this.props.createUser({ ...userData, createdAt: new Date() }, () => {
          this.displaySuccess('Created successfully')
          this.setState({ ...this.state, isEdit: false })
        }, () => {
          this.displayFailure('Failed creating')
        });
      }
    } else if (selectedMenu === MenuKey.UserGroup && selectedUserGroup.userID) {
      if (selectedUserGroup.userID.length === 0) {
        this.displayFailure('Select atleast one user to assign')
      }

      this.props.addUserToUserGroup({
        userID: selectedUserGroup.userID,
        userGroupID: selectedUserGroup.userGroupID
      }, () => {
        this.displaySuccess('Created successfully')
        this.setState({ ...this.state, isEdit: false })
      }, () => {
        this.displayFailure('Failed creating')
      });
    }
  }

  displaySuccess = (message) => {
    Modal.success({
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() { },
    });
  }

  displayFailure = (message) => {
    Modal.error({
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() { },
    });
  }

  renderUserGroupForm = () => {
    const { selectedUserGroup } = this.state;
    return <div style={{ margin: 20 }}>
      <Title level={3}>{selectedUserGroup.userGroupID}</Title>
      <br />
    </div>
  }

  renderListForMenu = () => {
    const { selectedMenu, selectedUser, selectedUserGroup, selectedSystemRole } = this.state;
    const listData = this.getListDataForMenu();

    switch (selectedMenu) {
      case MenuKey.UserGroup:
        return <List
          dataSource={listData || []}
          renderItem={item => (
            <List.Item style={{ backgroundColor: selectedUserGroup && selectedUserGroup.userGroupID === item.userGroupID ? '#1890ff' : 'white' }}
              onClick={() => this.setState({ selectedUserGroup: item })}>
              <div style={{ marginLeft: 20 }}>
                {item.userGroupID}
              </div>
            </List.Item>
          )}
        />
      case MenuKey.Roles:
        return <List
        dataSource={listData || []}
        renderItem={item => (
          <List.Item style={{ backgroundColor: selectedSystemRole && selectedSystemRole.sRole === item.sRole ? '#1890ff' : 'white' }}
            onClick={() => this.setState({ selectedSystemRole: item })}>
            <div style={{ marginLeft: 20 }}>
              {item.sRole}
            </div>
          </List.Item>
        )}
      />
      case MenuKey.Users:
      default:
        return <List
          dataSource={listData || []}
          renderItem={item => (
            <List.Item style={{ backgroundColor: selectedUser && selectedUser.userID === item.userID ? '#1890ff' : 'white' }}
              onClick={() => this.setState({ selectedUser: { ...item, sRoleID: item.sRoleID, jobRoleID: item.jobRoleID } })}>
              <div style={{ marginLeft: 20 }}>
                {item.FirstName + ' ' + item.LastName}
              </div>
            </List.Item>
          )}
        />
    }
  }

  render() {
    const { selectedMenu, isEdit } = this.state;
    const isRole = selectedMenu === MenuKey.Roles;

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key={MenuKey.Users}>{MenuKey.Users}</Menu.Item>
        <Menu.Item key={MenuKey.UserGroup}>{MenuKey.UserGroup}</Menu.Item>
        <Menu.Item key={MenuKey.Roles}>{MenuKey.Roles}</Menu.Item>
      </Menu>
    );

    return (
      <Layout>
        <Sider width={SIDER_WIDTH} className="sider-container" >
          <Dropdown
            overlay={menu}
          >
            <Button block>
              {selectedMenu} <DownOutlined />
            </Button>
          </Dropdown>
          <div style={{ flex: 1 }}>
            <Search
              placeholder={`Search ${selectedMenu}`}
              onChange={e => this.setState({ filterText: e.target.value })}
              onSearch={value => this.setState({ filterText: value })}
              style={{ width: SIDER_WIDTH }}
            />
            {this.renderListForMenu()}
          </div>
        </Sider>
        <Layout className="site-layout-background">
          <Content>
            {this.renderForm()}
          </Content>
        </Layout>
        <Footer className="content-footer" style={{ justifyContent: isRole ? 'flex-end' : 'space-between' }}>
          <div className="footer-left">
            {selectedMenu !== MenuKey.Roles && <IconButton title="Add" icon={<PlusOutlined />} onClick={this.onAddNewButtonClick} />
            }
            {selectedMenu !== MenuKey.Roles && <IconButton title="Delete" icon={<DeleteOutlined />} style={{ marginLeft: 20 }} onClick={this.onDeleteUserClick} />
            }
          </div>
          {!isEdit && <IconButton title="Edit" style={{ marginRight: 12, width: 100 }} icon={<EditOutlined />} onClick={() => this.setState({ isEdit: true })} />}
          {isEdit && <div>
            <IconButton title="Cancel" icon={<CloseSquareOutlined />} style={{ marginRight: 12, width: 100 }} onClick={() => this.setState({ isEdit: false })} />
            {selectedMenu !== MenuKey.Roles && <IconButton title="Save" icon={<SaveOutlined />} style={{ marginRight: 12, width: 100 }} onClick={this.saveData} />}
          </div>}
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users && state.users.users,
    userGroups: state.userGroups && state.userGroups.userGroups,
    jobRoles: state.jobRoles && state.jobRoles.jobRoles,
    systemRoles: state.jobRoles && state.systemRoles.systemRoles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createUser: (userData, success, failure) => dispatch(actions.createUserRequest({ userData }, success, failure)),
    updateUser: (userData, success, failure) => dispatch(actions.updateUserRequest({ userData }, success, failure)),
    addUserToUserGroup: (data, user, success, failure) => dispatch(actions.addUserToUserGroupRequest(data, user, success, failure)),
    removeUserFromUserGroup: (data, user, success, failure) => dispatch(actions.deleteUserToUserGroupRequest(data, user, success, failure)),
    getUsers: () => dispatch(actions.getUserRequest()),
    getUserGroups: () => dispatch(actions.getUserGroupRequest()),
    getJobRoles: () => dispatch(actions.getJobRoleRequest()),
    getSystemRoles: () => dispatch(actions.getSystemRoleRequest()),
    deleteUser: (userID, success, failure) => dispatch(actions.deleteUserRequest(userID, success, failure)),
    createUserGroup: (data, success, failure) => dispatch(actions.createUserGroupRequest(data, success, failure)),
    deleteUserGroup: (data, success, failure) => dispatch(actions.deleteUserGroupRequest(data, success, failure)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(withRouter(UserConfiguration)));