import React, { useState} from 'react';

import logo from './styles/sock@3x.png';
import './styles/LoginMain.css';
import './fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const url = require("url");
const configData = require('./config.json');
const hash = require('./md5');

var executed = 0;
var count = 0;

const BASE_URL = configData.ip;

function Login() {
  const openModal = () => {
    var modal = document.getElementById("nobackdrop");
    modal.classList.remove('nobackdrop');
    modal.classList.add('backdrop');
  }
  const openModal2 = () => {
    var modal = document.getElementById("nobackdrop2");
    modal.classList.remove('nobackdrop2');
    modal.classList.add('backdrop2');
    userResetPasswordUsernameIn.value = '';
    userSecretCodeIn.value = '';
    userNewPasswordIn.value = '';
  }
  const openModal3 = () => {
    var modal = document.getElementById("nobackdrop3");
    modal.classList.remove('nobackdrop3');
    modal.classList.add('backdrop3');
    userSecretCodeIn.value = '';
    userNewPasswordIn.value = '';
  }
  const closeModal = () => {
    var modal = document.getElementById("nobackdrop");
    modal.classList.remove('backdrop');
    modal.classList.add('nobackdrop');
  }
  const closeModal2 = () => {
    var modal = document.getElementById("nobackdrop2");
    modal.classList.add('nobackdrop2');
    setIsLoading(true);
  }
  const closeModal3 = () => {
    var modal = document.getElementById("nobackdrop3");
    modal.classList.add('nobackdrop3');
    setIsLoading(true);
  }

  var userIn;
  var passIn;
  var userSignupIn;
  var passSignupIn;
  var firstIn;
  var lastIn;
  var emailIn;
  var userSecretCodeIn;
  var userNewPasswordIn;
  var userResetPasswordUsernameIn;

  const [message, setMessage] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [theMessage, setTheMessage] = useState(true);

  const validateToken = async event => {


    if (executed) {
      while (count < 15) // This loop is important, otherwise the website overwrites this message
      {
        if (url.parse(window.location.href, true).query.validationId) {
          setMessage("Email validated! Please log in.");
        }
        count = count + 1
      }
      return;
    } else {
      executed = 1;
    }

    // Get token from link and if its there do validation
    const ddd = window.location.href;
    if (url.parse(ddd, true).query.validationId) {
      var validationId = url.parse(ddd, true).query.validationId;

      var userTokenId = '{"validationID":"'
        + validationId
        + '"}';

      try {
        const response = await fetch(BASE_URL + 'api/validateToken',
          { method: 'POST', body: userTokenId, headers: { 'Content-Type': 'application/json' } });

        var res = JSON.parse(await response.text());

        // setMessages do not work because the page reloads. Tried work arounds but nothing worked.
        // So now whenever a page with a validationID is loaded, it just assumes that the email
        // verification worked. 
        if (res.status === "found") {
        } else {
        }

      }
      catch (e) {
        alert(e.toString());
        return;
      }
    }
  };



  validateToken();


  const doSignup = async event => {
    event.preventDefault();

    if (userSignupIn.value === "" || passSignupIn.value === "" || firstIn.value === "" || lastIn.value === "" || emailIn.value === "") {
      setSignupMessage("Please fill in all of the blanks.");
      return;
    }

    //password encryption
    var hashed = hash(passSignupIn.value);
    var userInfo = '{"login":"'
      + userSignupIn.value
      + '","password":"' 
      + hashed // <- 'hashed' instead of passSignupIn.value
      + '","firstName":"'
      + firstIn.value
      + '","lastName":"'
      + lastIn.value
      + '","email":"'
      + emailIn.value
      + '"}';

    try {
      const response = await fetch(BASE_URL + 'api/signUp',
        { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

      var res = JSON.parse(await response.text());

      if (res.status === "User already taken!") {
        // Case for when the username is already taken
        setSignupMessage("Username already exits");
      }
      else {
        // Case for when the username does not exist
        setMessage("Account created! Please verify your email.");
        closeModal();

      }
    }
    catch (e) {
      alert(e.toString());
      return;
    }
  };

  const doLogin = async event => {
    event.preventDefault();

    //password  encryption
    let hashed = hash(passIn.value);
    let js = '{"login":"'
      + userIn.value
      + '","password":"'
      + hashed + '"}'; // <- 'hashed' instead of passIn.value

    try {
      const response = await fetch(BASE_URL + 'api/login',
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

      var res = JSON.parse(await response.text());

      if (res.id <= 0) {
        setMessage('User/Password combination incorrect.');
      }
      else {
        if (!res.isValid) {
          setMessage("Please verify your email first!");
          return;
        }
        var user = { firstName: res.firstName, lastName: res.lastName, id: res.id, username: res.username, following: res.Following, followers: res.Followers, ProfilePicture: res.ProfilePicture, favSocks: res.favSocks }
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('user_pfp', res.ProfilePicture);
        localStorage.setItem('user_favSocks', res.favSocks);
        localStorage.setItem('user_following', res.Following);
        localStorage.setItem('user_followers', res.Followers);
        setMessage('');
        window.location.href = '/onlysocks';
      }
    }
    catch (e) {
      alert(e.toString());
      return;
    }
  };

  async function resetPasswordConfirmation()
  {

    //password encryption
    var hashed = hash(userNewPasswordIn.value);
    var js = '{"username": "' + userResetPasswordUsernameIn.value + '", "code": "' + userSecretCodeIn.value + '", "newPassword": "' + hashed + '"}'; // <- 'hashed' instead of userNewPasswordIn.value
    const response = await fetch(BASE_URL + 'api/resetPasswordConfirmCode',
      { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        var res = JSON.parse(await response.text());

        if (res.status === 0) {
          // Code not found
          closeModal3();
          setMessage("Code not found. Please try again.");

        } else if (res.status === 2) {
          // Code found but wrong username
          closeModal3();
          setMessage("Username and confirmation code do not match. Please try again.");

        } else {
          // Password reset
          closeModal3();
          setMessage("Password has been reset!");
        }
  }

  async function askForUsernameReset() {

    try {
      var js = '{"username":"'
        + userResetPasswordUsernameIn.value
        + '"}';

      setIsLoading(false);
      setTheMessage("Reseting...");
      var response = await fetch(BASE_URL + 'api/resetPasswordSendEmail',
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
      var res = await JSON.parse(await response.text());


      if (res.status <= 0) {
        // Error sending email
        setTheMessage("Username not found!");
      } else {
        // Email sent
        closeModal2();
        openModal3();
      }
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <div className="App">
      <div className="Login-header">
        <div id="nobackdrop" className="nobackdrop">
          <div className="modal">
            <div id="signupelements">
              <u>
                <b><span className="pad">Create Account</span></b>
              </u>
              <p className="signup">Please enter your information.</p>
              <hr className="smol"></hr>
              <form>
                  <div>
                      <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={['fas', 'user']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                      <input id="firstIn" className="inputslong" style={{ marginLeft: '10px' }} type="text" placeholder="First Name" ref={(c) => firstIn = c}></input>
                      <br></br>
                      <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={['fas', 'signature']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                      <input id="lastIn" className="inputslong" type="text" placeholder="Last Name" ref={(c) => lastIn = c}></input>
                      <br></br>
                      <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={['fas', 'terminal']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                      <input id="userSignupIn" className="inputslong" type="text" placeholder="Username" ref={(c) => userSignupIn = c}></input>
                      <br></br>
                      <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={['fas', 'lock']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                      <input id="passSignupIn" className="inputslong" style={{ marginLeft: '10px' }} type="password" placeholder="Password" ref={(c) => passSignupIn = c}></input>
                      <br></br>
                      <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={['fas', 'envelope']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                      <input id="emailIn" className="inputslong" style={{ marginLeft: '7px' }} type="text" placeholder="Email Address" ref={(c) => emailIn = c}></input>
                </div>
              </form>
              <span id="signupResult" className="loginmessage">{signupMessage}</span>
              <div className="footer">
                <button className="button" onClick={doSignup}>
                  <b>Create Account</b>
                </button>
                      &nbsp;
                      <button className="button" onClick={closeModal}>
                  <b>Close</b>
                </button>
              </div>
            </div>
          </div>
        </div>



        <div id="nobackdrop2" className="nobackdrop2">
          <div className="modal2">
            <div id="resetPasswordElements">
              <u>
                <b><span className="pad">Reset Password</span></b>
              </u>
              <p className="signup">Please enter your information.</p>
              <hr className="smol"></hr>
              <form>
                <div id="theSpot">

                  <span><FontAwesomeIcon icon={['fas', 'terminal']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                              &nbsp;
                              <input id="userResetPasswordUsername" className="inputslong" type="text" placeholder="Username" ref={(c) => userResetPasswordUsernameIn = c}></input>

                </div>
                {isLoading ? <p></p> : <p>{theMessage}</p>}
              </form>
              <span id="signupResult" className="loginmessage">{signupMessage}</span>
              <div className="footer">
                <button className="button" onClick={askForUsernameReset}>
                  <b>Reset Password</b>
                </button>
                        &nbsp;
                        <button className="button" onClick={closeModal2}>
                  <b>Close</b>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="nobackdrop3" className="nobackdrop3">
          <div className="modal3">
            <div id="resetPasswordElements2">
              <u>
                <b><span className="pad">Confirm Your Confirmation Code</span></b>
              </u>
              <p className="signup">Please enter the code that was sent to your email.</p>
              <hr className="smol"></hr>
              <form>
                <div>
                  <span>
                     <FontAwesomeIcon icon={['fas', 'user-secret']} size='sm' style={{ color: 'white' }} transform='down-4' />
                  </span>
                     &nbsp;
                      <input id='userSecretCode' className='inputslong' type='text' placeholder='Secret Code in the email' ref={(c) => userSecretCodeIn = c}>
                      </input>
                </div>
                <div>
                    <span>
                        <FontAwesomeIcon icon={['fas', 'lock']} size='sm' style={{ color: 'white' }} transform='down-4' />
                    </span>
                    &nbsp;
                    <input id='userNewPassword' className='inputslong' type='password' placeholder='New Password' ref={(c) => userNewPasswordIn = c}/>
                </div>
              </form>
              <span id="signupResult" className="loginmessage">{signupMessage}</span>
              <div className="footer">
                <button className="button" onClick={resetPasswordConfirmation}>
                  <b>Reset Password</b>
                </button>
                        &nbsp;
                        <button className="button" onClick={closeModal3}>
                  <b>Close</b>
                </button>
              </div>
            </div>
          </div>
        </div>


        <form onSubmit={doLogin}>
          <div className="loginFrame">
            <b><p>Welcome to OnlySocks!</p></b>
            <img src={logo} className="App-logo" alt="logo" />
            <div>
              <div>
                <span><FontAwesomeIcon icon={['fas', 'user']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                  &nbsp;
                  <input id="userIn" className="inputs" type="text" placeholder="Username" ref={(c) => userIn = c}></input>
              </div>
              <div>
                <span><FontAwesomeIcon icon={['fas', 'lock']} size="sm" style={{ color: 'white' }} transform="down-4" /></span>
                  &nbsp;
                  <input id="passIn" className="inputs" type="password" placeholder="Password" ref={(c) => passIn = c}></input>
              </div>
            </div>
            <div className="buttonspace">
              <button type="submit" className="button" onClick={doLogin}>
                <FontAwesomeIcon icon={['fas', 'sign-in-alt']} size="sm" style={{ color: 'white' }} transform="" />
                <b>&nbsp; Sign in</b>
              </button>
            </div>
            <span id="loginResult" className="loginmessage">{message}</span>
            <div id="noLogin">
              <div id="signUp">
                <p className="signup">Don't have an account? <button id="modal-btn" className="link" onClick={openModal}>Sign Up!</button></p>
                <p className="signup">Forgot password? <button id="modal-btn" className="link" onClick={openModal2}>Reset Password</button></p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div >
  );
};
export default Login;
