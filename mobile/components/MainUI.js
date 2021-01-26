import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity, Settings, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { NativeRouter, Route, Switch, useHistory } from "react-router-native";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faSignature, faTerminal, faEnvelope, faSearch, faPaperPlane, fas, faUsers, faUserShield, faWindowClose, faImage, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { WebViewQuillEditor, WebViewQuillViewer } from 'react-native-webview-quilljs'
import styles from './styles/styles'
import StatusView from './StatusView';
import AsyncStorage from '@react-native-community/async-storage';
import { render } from 'react-dom';
import ImageRotating from './ImageRotating';
import * as ImagePicker from 'expo-image-picker';
import { Searchbar } from 'react-native-paper';
import FollowView from './FollowView';


// TODO: image picker for profile page

// const configData = require('./config.json');
// const BASE_URL = configData.ip;
var BASE_URL = 'https://onlysocks.herokuapp.com/'

var userswhofollow = [];
var userswhoarefollowing = [];
var userswhoarefollowingid = [];
var returnviewfollower = [];
var returnviewfollowing = [];
var numoffollowers = 0;
var numoffollowing = 0;
var followbutid = 0;

var firstName;
var lastName;
var userid;
var login;
var following = [];
var followers = [];
var profilePicture;



AsyncStorage.getItem('user_data').then((_ud) => {
    // console.log(_ud);
    var ud = JSON.parse(_ud);
    // console.log(ud);
    firstName = ud.firstName;
    lastName = ud.lastName;
    userid = ud.id;
    login = ud.username;
    // following = ud.following;
    followers = ud.followers;
    profilePicture = ud.ProfilePicture;
    // console.log(following); 


});

AsyncStorage.getItem('user_following').then((_ud) => {
    // console.log(_ud);
    var ud = JSON.parse(_ud);

    following = ud.following;
    // console.log(following);

});

function Feed() {



    const [openStatus, setModalOpen] = useState(false);
    const [postContent, setPostContent] = React.useState('');
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    var postContentValue;
    var views = [];
    const { width, height } = Dimensions.get('window');
    // console.log(width);
    // width={width} height={height}


    const postStatus = async event => {
        /* var sockVarients = ['socks', 'Socks', 'soxs', 'sox', 'sock', 'Sock', '#socks', '#Socks', '#sock', '#Sock'];
         var doesContainSocks;
         for (var i = 0; i < sockVarients.length; i++) {
             if (postContentValue.includes(sockVarients[i]))
                 doesContainSocks = 1;
             else
                 doesContainSocks = 0;
         }*/

        // Send a request to the server and add the post
        var userInfo = '{"userid":"'
            + userid
            + '","login":"'
            + login
            + '","content":"'
            + postContent + '"}';

        if (postContent.includes("socks") || postContent.includes("Socks") || postContent.includes("sock") || postContent.includes("Sock")) {
            try {


                const response = await fetch(BASE_URL + 'api/createPost',
                    { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

                var res = JSON.parse(await response.text());

                if (res.status === 0) {
                    // code
                    console.log("Not posted!");
                    Alert.alert('Backend', 'Check Backend!');
                }
                if (res.status === 1) {
                    // code
                    console.log("Posted!");
                    setModalOpen(false);
                    getStatuses();
                }
                else {
                    // code
                    console.log("Not enough content!");
                    Alert.alert('Not posted', 'Please post more!');
                }


            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            Alert.alert("Non Sock Intruder", "It seems that your post does not pertain to socks...please reconsider...");
        }

    };

    const openModalCommands = async event => {
        setModalOpen(true);
        setPostContent('');
        // console.log(userid);
    };


    // Hook for Modal triggering
    const openCModalCommands = async event => {
        setModalOpen(true);
        setPostContent('');
        // console.log(userid);
    };

    const getFollowing = async event => {
        var res = [];
        var body = '{"loggeduserid": "' + userid + '"}';
        var returnview = [];
        var followid = 0;

        try {
            const response = await fetch(BASE_URL + 'api/getFollowing',
                { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });

            res = JSON.parse(await response.text());

            for (var i = 0; i < (res.length - 1); i++) {
                userswhoarefollowing[i] = res[i].usersfollowing;
                userswhoarefollowingid[i] = res[i].userfollowingid;

                returnviewfollowing[i] = <FollowView key={followbutid.toString()} followList={following} loggeduserid={userid} user={userswhoarefollowing[i]} userid={userswhoarefollowingid[i]} key={"follow" + followid} isFollowing={"Following"} class={"followpeeps"} classbut={"followButton"} followbuttonid={followbutid.toString()} />
                followid++;
                followbutid++;
            }
            numoffollowing = res[res.length - 1].followingnum;


        }
        catch (e) {
            alert(e.toString());
            return;
        }
    }

    const getFollowers = async event => {
        var res = [];
        var body = '{"loggeduserid": "' + userid + '"}';
        var returnview = [];
        var followid = 0;
        var followbutval;

        try {
            const response = await fetch(BASE_URL + 'api/getFollowers',
                { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });

            res = JSON.parse(await response.text());

            for (var i = 0; i < (res.length - 1); i++) {
                userswhofollow[i] = res[i].follower;

                followbutval = isUserFollowing(userswhofollow[i]);
                returnviewfollower[i] = <FollowView key={followbutid.toString()} followList={following} loggeduserid={userid} user={userswhofollow[i]} userid={userswhoarefollowingid[i]} key={"follow" + followid} isFollowing={followbutval} class={"followpeeps"} classbut={"followButton"} followbuttonid={followbutid.toString()} />

                followid++;
                followbutid++;
            }
            if (res[res.length - 1].followernum != undefined || res[res.length - 1].followernum != "undefined") {
                numoffollowers = res[res.length - 1].followernum;
            }
            else {
                numoffollowers = 0;
            }


        }
        catch (e) {
            alert(e.toString());
            return;
        }
    }
    function isUserFollowing(userwhofollows) {

        if (userswhoarefollowing.includes(userwhofollows))
            return ("Following");
        else
            return ("Follow");
    }


    async function getStatuses() {
        setIsLoading(true);

        AsyncStorage.getItem('user_following').then((_ud) => {
            // console.log(_ud);
            var ud = JSON.parse(_ud);

            following = ud.following;
            // console.log(following);

        });

        var res = [];

        var js = '{"userid": "' + userid + '", "following": "' + following + '"}';

        try {

            const response = await fetch(BASE_URL + 'api/getPosts',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            res = JSON.parse(await response.text());
            for (let i = (res.length - 1); i >= 0; i--) {
                // comments={res[i].comments}
                // console.log(res[i]);
                views.push(
                    <View key={i}>
                        <StatusView user={res[i].username} status={res[i].status} postid={res[i].postids} likes={res[i].likes} userid={userid} comments={res[i].comments} currentUser={login} newCommentsCounter={i} profilePic={profilePicture} />
                    </View>
                )
            }
            setStatuses(views);
            setIsLoading(false);
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    useEffect(() => { getStatuses(), getFollowing(), getFollowers() }, [])

    function _onRefresh() {
        setRefreshing(true);
        getStatuses().then(() => {
            setRefreshing(false);
        });



        getFollowing();
        getFollowers();
    }


    return (
        <View style={styles.feedContainer} >
            <ScrollView id="mainScroll" width={width} height={height} refreshControl={<RefreshControl width={width} height={height} refreshing={refreshing} onRefresh={_onRefresh} />}>
                {
                    isLoading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 300 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 27, color: '#ffffff' }} >Loading...</Text>
                        </View>
                        : statuses
                }

            </ScrollView>

            <TouchableOpacity
                style={styles.submitButtonStyle}
                activeOpacity={.5}
                onPress={() => openModalCommands()}
            >
                <FontAwesomeIcon icon={faPaperPlane} size={26} style={{ color: 'white', }} />
            </TouchableOpacity>

            <Modal visible={openStatus} animationType='slide' >
                <View style={styles.createPostContainer}>
                    <View style={{ flexDirection: 'column', flex: 1, marginTop: 100, justifyContent: 'space-between' }}>
                        <TextInput
                            placeholder=" What's on your feet..."
                            onChangeText={text => setPostContent(text)}
                            value={postContentValue}
                            underlineColorAndroid="transparent"
                            style={styles.postInput}
                        />
                        <View style={{ flex: 1, flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                            <View style={{ width: 150, marginLeft: 30 }}>
                                <TouchableOpacity
                                    style={styles.postbutton}
                                    activeOpacity={.5}
                                    onPress={() => setModalOpen(false)}
                                >
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                                        <FontAwesomeIcon icon={faWindowClose} size={26} style={{ color: 'white', }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: 150, marginLeft: 30 }}>
                                <TouchableOpacity
                                    style={styles.postbutton}
                                    activeOpacity={.5}
                                    onPress={postStatus}
                                >
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Post</Text>
                                        <FontAwesomeIcon icon={faPaperPlane} size={26} style={{ color: 'white', }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>

    );
}

async function sendToDatabase(theBase64, fileName) {

    theBase64 = "data:image/png;base64," + theBase64;
    // console.log(theBase64);

    let body = '{"userId":"'
        + userid
        + '","profilePicture":"'
        + fileName
        + '","theFile":"'
        + theBase64
        + '"}';

    try {

        const response = await fetch(BASE_URL + 'api/addNewProfilePicture',
            { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });

        var res = JSON.parse(await response.text());

        // console.log(res.status);
        if (res.status === 0) {
            // success
        }

        else {
            // fail
        }

    } catch (error) {
        console.error(error);
    }
}

function Profile() {
    let [selectedImage, setSelectedImage] = React.useState(null);

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        })
        if (pickerResult.cancelled === true) {
            return;
        }

        // console.log(pickerResult);
        sendToDatabase(pickerResult.base64, pickerResult.uri.split('ImagePicker/')[1]);
        setSelectedImage({ localUri: pickerResult.uri });
    };


    if (selectedImage !== null) {
        profilePicture = selectedImage.localUri;
        // return (

        //   <View style={styles.container}>
        //     <Image source={{ uri: profilePicture }} style={styles.profileAvatar}/>
        //   </View>
        // );
    }

    const history = useHistory();

    const doLogout = event => {
        event.preventDefault();
        history.push('/');
    };

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    // const doPicUpload = () => {

    // };

    const [openStatus, setModalOpen] = useState(false);
    const [postContent, setPostContent] = React.useState('');
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    var postContentValue;
    var views = [];
    const { width, height } = Dimensions.get('window');
    // console.log(width);
    // width={width} height={height}


    const postStatus = async event => {
        /* var sockVarients = ['socks', 'Socks', 'soxs', 'sox', 'sock', 'Sock', '#socks', '#Socks', '#sock', '#Sock'];
         var doesContainSocks;
         for (var i = 0; i < sockVarients.length; i++) {
             if (postContentValue.includes(sockVarients[i]))
                 doesContainSocks = 1;
             else
                 doesContainSocks = 0;
         }*/

        // Send a request to the server and add the post
        var userInfo = '{"userid":"'
            + userid
            + '","login":"'
            + login
            + '","content":"'
            + postContent + '"}';

        if (postContent.includes("socks") || postContent.includes("Socks") || postContent.includes("sock") || postContent.includes("Sock")) {
            try {


                const response = await fetch(BASE_URL + 'api/createPost',
                    { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

                var res = JSON.parse(await response.text());

                if (res.status === 0) {
                    // code
                    console.log("Not posted!");
                    Alert.alert('Backend', 'Check Backend!');
                }
                if (res.status === 1) {
                    // code
                    console.log("Posted!");
                    setModalOpen(false);
                    getStatuses();
                }
                else {
                    // code
                    console.log("Not enough content!");
                    Alert.alert('Not posted', 'Please post more!');
                }


            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            Alert.alert("Non Sock Intruder", "It seems that your post does not pertain to socks...please reconsider...");
        }

    };

    const openModalCommands = async event => {
        setModalOpen(true);
        setPostContent('');
        // console.log(userid);
    };


    // Hook for Modal triggering
    const openCModalCommands = async event => {
        setModalOpen(true);
        setPostContent('');
        // console.log(userid);
    };

    async function getStatuses() {
        setIsLoading(true);
        var res = [];

        var js = '{"userid": "' + userid + '", "following": "' + following + '"}';

        try {

            const response = await fetch(BASE_URL + 'api/getProfilePosts',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            res = JSON.parse(await response.text());
            for (let i = (res.length - 1); i >= 0; i--) {
                // comments={res[i].comments}
                // console.log(res[i]);
                views.push(
                    <View key={i}>
                        <StatusView user={res[i].username} status={res[i].status} postid={res[i].postids} likes={res[i].likes} userid={userid} comments={res[i].comments} currentUser={login} newCommentsCounter={i} profilePic={profilePicture} />
                    </View>
                )
            }
            setStatuses(views);
            setIsLoading(false);
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    useEffect(() => { getStatuses() }, [])

    function _onRefresh() {
        setRefreshing(true);
        getStatuses().then(() => {
            setRefreshing(false);
        });
    }


    return (
        <View style={styles.profileContainer}>
            <View style={{ flexDirection: 'row' }}>
                <Image style={styles.profileAvatar} source={{ uri: profilePicture }} />
                <View style={{ marginTop: 50, marginLeft: 20 }}>
                    <Text style={styles.profileName}>{login}</Text>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    style={styles.loginbut}
                    activeOpacity={.5}
                    onPress={openImagePickerAsync}
                >
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <FontAwesomeIcon icon={faImage} size={20} style={{ color: '#ffffff' }} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Change Profile Picture</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    style={styles.loginbut}
                    activeOpacity={.5}
                    onPress={doLogout}
                >
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <FontAwesomeIcon icon={faSignOutAlt} size={20} style={{ color: '#ffffff' }} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>


            <View style={styles.feedContainer} >
                <ScrollView id="mainScroll" width={width} height={height} refreshControl={<RefreshControl width={width} height={height} refreshing={refreshing} onRefresh={_onRefresh} />}>
                    {
                        isLoading ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 150 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 27, color: '#ffffff' }} >Loading...</Text>
                            </View>
                            : statuses
                    }

                </ScrollView>

                <TouchableOpacity
                    style={styles.submitProfileButtonStyle}
                    activeOpacity={.5}
                    onPress={() => openModalCommands()}
                >
                    <FontAwesomeIcon icon={faPaperPlane} size={26} style={{ color: 'white', }} />
                </TouchableOpacity>

                <Modal visible={openStatus} animationType='slide' >
                    <View style={styles.createPostContainer}>
                        <View style={{ flexDirection: 'column', flex: 1, marginTop: 100, justifyContent: 'space-between' }}>
                            <TextInput
                                placeholder=" What's on your feet..."
                                onChangeText={text => setPostContent(text)}
                                value={postContentValue}
                                underlineColorAndroid="transparent"
                                style={styles.postInput}
                            />
                            <View style={{ flex: 1, flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ width: 150, marginLeft: 30 }}>
                                    <TouchableOpacity
                                        style={styles.postbutton}
                                        activeOpacity={.5}
                                        onPress={() => setModalOpen(false)}
                                    >
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                                            <FontAwesomeIcon icon={faWindowClose} size={26} style={{ color: 'white', }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: 150, marginLeft: 30 }}>
                                    <TouchableOpacity
                                        style={styles.postbutton}
                                        activeOpacity={.5}
                                        onPress={postStatus}
                                    >
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Post</Text>
                                            <FontAwesomeIcon icon={faPaperPlane} size={26} style={{ color: 'white', }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

function TopSocks() {
    return (
        <View style={styles.container}>
            <Text>TopSocks!</Text>
        </View>
    );
}

function Search() {
    const [searchQuery, setSearchQuery] = React.useState([]);
    const [openStatusfollow, setModalOpenFollow] = useState(false);
    const [openStatusfollowing, setModalOpenFollowing] = useState(false);
    // const onChangeSearch = query => setSearchQuery(query);

    const onChangeSearch = async event => {
        

        var res = [];
        var users = [];
        var returnview = [];
        var followbutval;
        var body = '{"username": "' + event.toString() + '", "loggeduser": "' + login + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/getUsers',
                { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });

            res = JSON.parse(await response.text());

            for (var i = 0; i < res.length; i++) {
                users[i] = res[i].username;
                followbutval = isUserFollowing(users[i]);
                //for (var j = 0; j < (res[i].following).length; j++) {}

                returnview.push(<FollowView key={followbutid.toString()} followList={following} loggeduserid={userid} user={users[i]} userid={userswhoarefollowingid[i]} isFollowing={followbutval} class={"searchfollowpeeps"} classbut={"searchfollowButton"} followbuttonid={"test" + followbutid.toString()} />);
                followbutid++;
            }
            setSearchQuery(returnview);
            // console.log(returnview);

        }catch(e)
        {
            //pass
            console.log(e);
        }
    };
        var returnviewSearch = [];
        const openModalFollow = async event => {
            setModalOpenFollow(true);
        };
        const openModalFollowing = async event => {
            setModalOpenFollowing(true);
        };

        function isUserFollowing(userwhofollows) {

            if (userswhoarefollowing.includes(userwhofollows))
                return ("Following");
            else
                return ("Follow");
        }

        const searchUser = async event => {
            var res = [];
            var body = '{"username": "' + onChangeSearch + '", "loggeduser": "' + login + '"}';
            var users = [];

            var followbutval;
            // var following = [];
            // var follower = [];
            //console.log(searchusertext.value);
            //console.log(BASE_URL);
            try {
                const response = await fetch(BASE_URL + 'api/getUsers',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });

                res = JSON.parse(await response.text());

                for (var i = 0; i < res.length; i++) {
                    users[i] = res[i].username;
                    followbutval = isUserFollowing(users[i]);
                    //for (var j = 0; j < (res[i].following).length; j++) {}
                    returnviewSearch[i] = <FollowView key={followbutid.toString()} followList={following} loggeduserid={userid} user={users[i]} userid={userswhoarefollowingid[i]} isFollowing={followbutval} class={"searchfollowpeeps"} classbut={"searchfollowButton"} followbuttonid={followbutid.toString()} />
                    followbutid++;
                }

            }
            catch (e) {
                alert(e.toString());
                return;
            }
        }


        return (
            <View style={styles.searchfollowcontainer}>
                <View>
                    <Searchbar
                        placeholder="Search for friends..."
                        underlineColorAndroid="transparent"
                        onChangeText={onChangeSearch}
                    />
                    <View style={styles.followfollowing}>
                        <View style={styles.following}>
                            <TouchableOpacity
                                style={styles.followerbutton}
                                activeOpacity={.5}
                                onPress={() => openModalFollow()}
                            >
                                <View style={styles.followstuff}>
                                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Following </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesomeIcon icon={faUserShield} size={26} style={{ color: 'white', }} />
                                        <Text style={{ fontWeight: 'bold', color: '#ffffff' }}> : {numoffollowing}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.followers}>
                            <TouchableOpacity
                                style={styles.followerbutton}
                                activeOpacity={.5}
                                onPress={() => openModalFollowing()}
                            >
                                <View style={styles.followstuff}>
                                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Followers</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesomeIcon icon={faUsers} size={26} style={{ color: 'white', }} />
                                        <Text style={{ fontWeight: 'bold', color: '#ffffff' }}> : {numoffollowers}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>                  
                    </View>
                    <ScrollView style={{ marginTop: 100 }}>
                        {searchQuery}
                    </ScrollView>
                </View>
               
            
                <Modal visible={openStatusfollow} animationType='slide'>
                    <View style={styles.searchfollowcontainer}>
                        <TouchableOpacity
                            style={styles.loginbut}
                            activeOpacity={.5}
                            onPress={() => setModalOpenFollow(false)}
                        >
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Close</Text>
                            </View>
                        </TouchableOpacity>
                        <ScrollView>
                            {returnviewfollowing}
                        </ScrollView>
                    </View>
                </Modal>

                <Modal visible={openStatusfollowing} animationType='slide'>
                    <View style={styles.searchfollowcontainer}>
                        <TouchableOpacity
                            style={styles.loginbut}
                            activeOpacity={.5}
                            onPress={() => setModalOpenFollowing(false)}
                        >
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Close</Text>
                            </View>
                        </TouchableOpacity>
                        <ScrollView>
                            {returnviewfollower}
                        </ScrollView>
                    </View>

                </Modal>
            </View>
        );
    }

    const Tab = createMaterialBottomTabNavigator();

    function MainUI(state, descriptors, navigation) {

        const navTheme = {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: 'rgb(199, 97, 86)',
            },
        }

        return (

            <NavigationContainer theme={navTheme}>
                <Tab.Navigator
                    initialRouteName="Feed"
                    activeColor="#f2f2f2"
                    labelStyle={{ fontSize: 12 }}
                >

                    <Tab.Screen
                        name="Follow"
                        component={Search}
                        options={{
                            tabBarLabel: 'Follow',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="account-multiple" color={color} size={26} />
                            ),
                        }}
                    />

                    <Tab.Screen
                        name="Feed"
                        component={Feed}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="home" color={color} size={26} />
                            ),
                        }}
                    />
                    {/* <Tab.Screen
                name="TopSocks"
                component={TopSocks}
                options={{
                    tabBarLabel: 'Top Socks',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="fire" color={color} size={26} />
                    ),
                }}
            /> */}
                    <Tab.Screen
                        name="Profile"
                        component={Profile}
                        options={{
                            tabBarLabel: 'Profile',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                            ),
                        }}
                    />

                </Tab.Navigator>
            </NavigationContainer>
        );

    } export default MainUI