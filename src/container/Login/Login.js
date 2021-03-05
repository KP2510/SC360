import React from "react"
import { connect } from 'react-redux'
import { actionType } from '../../shared/actionType'
import { encrypt } from "../../utils/encryption"
import './Login.css'
import { withCookies } from 'react-cookie'
import BeatLoader from "react-spinners/BeatLoader"


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.loading = false
  }

  componentDidUpdate = () => {
    const { cookies, login } = this.props;
    if (Object.keys(login.userInfo).length && cookies.get('Authorization') && cookies.get('x-api-key')) {
      this.props.history.push('/dashboard')
    }
  }

  handleSubmit = () => {
    this.loading = true
    const name = this.input.value
    const pass = this.pass.value
    const encryptedUserName = encrypt(name);
    const encryptedPassword = encrypt(pass);
    const { cookies } = this.props;
    this.props.loginRequest(encryptedUserName, encryptedPassword, cookies);
    this.props.saveCredentials(encryptedUserName, encryptedPassword);
  }

  render() {
    return (
      <div className="Login">
        <main role='main'>
          <header className="head">
            SC360
        </header>
          <form action='#' id='js-form'>
            <div className='form-group'>
              {/* <label htmlFor='username'>Username</label> */}
              <input type='text' id='username' name='username' className='form-field' placeholder="Enter Username" ref={(userInput) => this.input = userInput} />
            </div>
            <div className='form-group'>
              {/* <label htmlFor='password'>Password</label> */}
              <input type='password' id='password' name='password' className='form-field' placeholder="Enter Password" ref={(userInput) => this.pass = userInput} />
            </div>
            <div className='form-controls'>
              {!this.loading ? (<button className='button login' type='button'
                //  disabled={!this.state.formValid} 
                onClick={this.handleSubmit}>Log In</button>)
                : (<BeatLoader
                  size={30}
                  color={"#ff8f1a"}
                  loading={this.loading}
                />)

              }
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { login: state.login };
}
const mapDispatchToProps = dispatch => {
  return {
    loginRequest: (encryptedUserName, encryptedPassword, cookies) => dispatch({ type: actionType.LOGIN_REQUEST, payload: { encryptedUserName, encryptedPassword }, cookies }),
    saveCredentials: (encryptedUserName, encryptedPassword) => dispatch({ type: actionType.SAVE_CREDENTIALS, payload: { encryptedUserName, encryptedPassword } })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Login));