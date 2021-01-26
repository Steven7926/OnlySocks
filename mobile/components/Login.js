import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity } from 'react-native';
import { NativeRouter, Route, Switch, useHistory } from "react-router-native";
import ImageRotating from './ImageRotating'
import LoginInputs from './LoginInputs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faSignature, faTerminal, faEnvelope, faSignInAlt, faUserPlus, faKey, faCheck, faWindowClose, faRedo } from '@fortawesome/free-solid-svg-icons'
import styles from './styles/styles'
import AsyncStorage from '@react-native-community/async-storage';
const hash = require('./md5');

// const configData = require('./config.json');
// const BASE_URL = configData.ip;
var BASE_URL = 'https://onlysocks.herokuapp.com/'

function Login() {
    // Hooks for Logging in 
    const [uservalue, onChangeUser] = React.useState('');
    const [passvalue, onChangePass] = React.useState('');

    // Hooks for SignUp
    const [userSignupIn, onChangeSignUser] = React.useState('');
    const [passSignupIn, onChangeSignPass] = React.useState('');
    const [firstIn, onChangeFName] = React.useState('');
    const [lastIn, onChangeLName] = React.useState('');
    const [emailIn, onChangeEmail] = React.useState('');
    const [userResetUsername, onUserResetUsername] = React.useState('');
    const [userResetCode, onUserResetCode] = React.useState('');
    const [userResetNewPassword, onUserResetNewPassword] = React.useState('');
    const [resetMessage, setResetMessage] = React.useState('');

    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenResetPass1, setModalOpenResetPass1] = useState(false);
    const [modalOpenResetPass2, setModalOpenResetPass2] = useState(false);

    const history = useHistory();

    //password encryption
    var hashed = hash(passvalue); 
    const doLogin = async event => {
        event.preventDefault();
        var js = '{"login":"'
            + uservalue
            + '","password":"'
            + hashed + '"}'; // <- 'hashed' instead of passvalue
        try {

            const response = await fetch(BASE_URL + 'api/login',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            // console.log(res);

            if (res.id <= 0) {
                Alert.alert('Please Review', 'User/Password combination incorrect.');
            }
            else {
                if (!res.isValid) {
                    Alert.alert('Not Verified', 'Please verify your email first!');
                    return;
                }
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id, username: res.username, following: res.Following, followers: res.Followers, ProfilePicture: res.ProfilePicture }
                var userFollowing = { following: res.Following }
                //Alert.alert('Success!!!!!!!!!!!!!!', 'YOU FUCKING DID IT!');
                // console.log(JSON.stringify(user));
                AsyncStorage.setItem('user_data', JSON.stringify(user));
                AsyncStorage.setItem('user_following', JSON.stringify(userFollowing));
                history.push('/onlysocks');
            }

        } catch (error) {
            console.error(error);
        }
    };

    const doSignup = async event => {
        event.preventDefault();

        //password encryption
        var hashed = hash(passSignupIn); 
        if (userSignupIn === "" || passSignupIn === "" || firstIn === "" || lastIn === "" || emailIn === "") {
            Alert.alert('Invalid Inputs', 'Please fill in all of the blanks.');
            return;
        }

        var userInfo = '{"login":"'
            + userSignupIn
            + '","password":"'
            + hashed // <- 'hashed' instead of passSignupIn
            + '","firstName":"'
            + firstIn
            + '","lastName":"'
            + lastIn
            + '","email":"'
            + emailIn
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/signUp',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status === "User already taken!") {
                // Case for when the username is already taken
                Alert.alert('Username already exits', 'It seems that username already exists, please choose a new one');
            }
            else {
                // Case for when the username does not exist
                Alert.alert("Success!", "Account created! Please verify your email.");
                setModalOpen(false);

            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    const resetPasswordCodeConfirmation = async event => {
        
        //password encryption
        var hashed = hash(userResetNewPassword); 
        var js = '{"username": "' + userResetUsername + '", "code": "' + userResetCode + '", "newPassword": "' + hashed + '"}'; // <- 'hashed' instead of userResetNewPassword
        const response = await fetch(BASE_URL + 'api/resetPasswordConfirmCode',
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        var res = JSON.parse(await response.text());

        if (res.status === 0) {
        // Code not found
        Alert.alert("Code not found. Please try again.");

        } else if (res.status === 2) {
        // Code found but wrong username
        Alert.alert("Username and confirmation code do not match. Please try again.");

        } else {
        // Password reset
        Alert.alert("Password has been reset!");
        setModalOpenResetPass2(false);
        }
    };

    const resetPassword = async event => {

        try {
            var js = '{"username":"'
              + userResetUsername
              + '"}';
            
            setResetMessage("Reseting password...");

            var response = await fetch(BASE_URL + 'api/resetPasswordSendEmail',
              { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            var res = await JSON.parse(await response.text());
      
            if (res.status <= 0) {
              // Error sending email
              Alert.alert("Username not found!");
              setResetMessage("Username not found!");
            } else {
              // Email sent
              setModalOpenResetPass1(false);
              setModalOpenResetPass2(true);
              setResetMessage('');
            }
          } catch (error) {
            console.log(error);
          }

    };


    return (
        <View style={styles.container}>
            <Modal visible={modalOpen} animationType='slide' >
                <View style={styles.signupcontainer}>
                    <ImageRotating />
                    <View style={{ flex: 1 }}>
                        <View style={{ width: 250, marginLeft: 25 }}>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faUser} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" First Name..."
                                        onChangeText={text => onChangeFName(text)}
                                        underlineColorAndroid="transparent"
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faSignature} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Last Name..."
                                        onChangeText={text => onChangeLName(text)}
                                        underlineColorAndroid="transparent"
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faTerminal} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Username..."
                                        onChangeText={text => onChangeSignUser(text)}
                                        underlineColorAndroid="transparent"
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faLock} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Password..."
                                        onChangeText={text => onChangeSignPass(text)}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={true}
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Email Address..."
                                        onChangeText={text => onChangeEmail(text)}
                                        underlineColorAndroid="transparent"
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: 15, width: 350 }}>
                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                                onPress={doSignup}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Up!</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closebutton}
                                activeOpacity={.5}
                                onPress={() => setModalOpen(false)}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center'}}>
                                    <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Close</Text>
                                </View>
                            </TouchableOpacity>
                        </View>                   
                    </View>
                </View>
            </Modal>

            <Modal visible={modalOpenResetPass1} animationType='slide' >
                <View style={styles.signupcontainer}>
                    <ImageRotating />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.logoText}>Reset Password</Text>
                            <View style={{ width: 250, marginLeft: 25 }}>
                            
                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesomeIcon icon={faTerminal} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                
                                    <View style={{ width: 260 }}>
                                        <TextInput
                                            placeholder=" Username..."
                                            onChangeText={text => onUserResetUsername(text)}
                                            underlineColorAndroid="transparent"
                                            style={styles.userInputs}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Text textAlign='center'>{resetMessage}</Text>
                        <View style={{ marginTop: 15, width: 350 }}>
                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                                onPress={resetPassword}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faRedo} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Reset Password</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ marginTop: 15, width: 350 }}>
                                <TouchableOpacity
                                    style={styles.loginbut}
                                    activeOpacity={.5}
                                    onPress={() => setModalOpenResetPass1(false)}
                                >
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Close</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>                   
                    </View>
                </View>
            </Modal>

            <Modal visible={modalOpenResetPass2} animationType='slide' >
                <View style={styles.signupcontainer}>
                    <ImageRotating />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.logoText}>Confirmation Code</Text>
                            <View style={{ width: 250, marginLeft: 25 }}>
                            
                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesomeIcon icon={faTerminal} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                
                                    <View style={{ width: 260 }}>
                                        <TextInput
                                            placeholder="Confirmation code"
                                            onChangeText={text => onUserResetCode(text)}
                                            underlineColorAndroid="transparent"
                                            style={styles.userInputs}
                                        />
                                    </View>
                                    
                                </View>


                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesomeIcon icon={faTerminal} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                
                                    <View style={{ width: 260 }}>
                                        <TextInput
                                            placeholder="New password"
                                            onChangeText={text => onUserResetNewPassword(text)}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={true}
                                            style={styles.userInputs}
                                        />
                                    </View>
                                </View>
                            </View>
                        <View style={{ marginTop: 15, width: 350 }}>
                            <Button
                                title="Reset Password"
                                onPress={resetPasswordCodeConfirmation}
                                color="rgb(199, 97, 86)"
                            />
                            <View style={{ marginTop: 15, width: 350 }}>
                                <Button
                                    title="Close"
                                    onPress={() => setModalOpenResetPass2(false)}
                                    color="rgb(199, 97, 86)"
                                />
                            </View>
                        </View>                   
                    </View>
                </View>
            </Modal>

          <ImageRotating />
            <Text style={styles.logoText}>OnlySocks</Text>
            <View style={{ flex: 1 }}>
                <View style={{ width: 250, marginLeft: 25 }}>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <FontAwesomeIcon icon={faUser} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                        <View style={{width: 230}}>
                            <TextInput
                                placeholder=" Username..."
                                onChangeText={text => onChangeUser(text)}
                                underlineColorAndroid="transparent"
                                style={styles.userInputs}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <FontAwesomeIcon icon={faLock} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                        <View style={{ width: 230 }}>
                            <TextInput
                                placeholder=" Password..."
                                onChangeText={text => onChangePass(text)}
                                underlineColorAndroid="transparent"
                                secureTextEntry={true}
                                style={styles.userInputs}

                            />
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 15, width: 300 }}>
                    <TouchableOpacity
                        style={styles.loginbut}
                        activeOpacity={.5}
                        onPress={doLogin}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faSignInAlt} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 50, width: 300 }}>
                    <TouchableOpacity
                        style={styles.loginbut}
                        activeOpacity={.5}
                        onPress={() => setModalOpen(true)}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faUserPlus} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Up!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 15, width: 300 }}>
                    <TouchableOpacity
                        style={styles.loginbut}
                        activeOpacity={.5}
                        onPress={() => setModalOpenResetPass1(true)}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faKey} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Forgot Password?</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
      </View>
  );
} export default Login;
