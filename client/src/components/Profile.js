import React from 'react';
import ReactDOM from 'react-dom';
import './styles/LoginMain.css';
import logo from './styles/sock@3x.png';
import './fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuillEditor from './QuillEditor';
import { statustext } from './QuillEditor'; // ES6
import ImageUploadFavSocks from './ImageUploadFavSocks';
import ProfileImageUploader from './ProfileImageUploader';
import StatusView from './StatusView';

const configData = require('./config.json');
const BASE_URL = configData.ip;
var textineditor = "";

function Profile() {

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var userid = ud.id;
    var login = ud.username;
    var following = ud.following;
    var profilePicture = localStorage.getItem('user_pfp');
    var favSocks = localStorage.getItem('user_favSocks');
    var followerIn;

    const openStatModal = () => {
        var modal = document.getElementById("nobackdrop");
        modal.classList.remove('nobackdrop');
        modal.classList.add('backdrop');
    }
    const closeStatModal = () => {
        var modal = document.getElementById("nobackdrop");
        modal.classList.remove('backdrop');
        modal.classList.add('nobackdrop');
    }

    const doLogout = event => {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };

    const goHome = event => {
        window.location.href = '/onlysocks';
    }

    const getFollowersView = () => {
        var home = document.getElementById('change');
        home.parentNode.removeChild(home);
        window.location.href = '/onlysocks/following';

    }
    const getProfileView = () => {
        var home = document.getElementById('change');
        home.parentNode.removeChild(home);
        window.location.href = '/onlysocks/profile';
    }

    const postStatuses = async event => {
        textineditor = statustext.replace(/[""]/g, '\\"');

        console.log(textineditor);
        event.preventDefault();
        var js = '{"userid":"'
            + userid
            + '","login":"'
            + login
            + '","content":"'
            + textineditor + '"}';

        if (!containsSocks(textineditor)) {
            alert("You really boutta post sumthn that ain't 'bout socks huh? Lmao try again fam.");
        }
        else {
            try {
                const response = await fetch(BASE_URL + 'api/createPost',
                    { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
                window.location.href = '/onlysocks/profile';
            }
            catch (e) {
                return;
            }
        }
    }

    const getStatuses = async event => {

        var js = '{"userid": "' + userid + '", "following": "' + following + '"}';
        var res = [];
        var statuses = [];
        var users = [];
        var numlikes = [];
        var postids = [];
        var returnStat = [];
        var comments = [];

        try {
            const response = await fetch(BASE_URL + 'api/getProfilePosts',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            res = JSON.parse(await response.text());

            for (var i = (res.length - 1); i >= 0; i--) {

                statuses[i] = res[i].status;
                users[i] = res[i].username;
                numlikes[i] = res[i].likes;
                postids[i] = res[i].postids;
                comments[i] = res[i].comments;
                returnStat[i] = <StatusView user={users[i]} status={statuses[i]} postid={postids[i]} likes={numlikes[i]} userid={ud.id} buttonCounter={"likeButton" + i} commentCounter={"commentCounter" + i} modalCounter={"modalCounter" + i} comments={res[i].comments} loggedInUsername={ud.username} commentBox={"commentBox" + i} />
            }
            ReactDOM.render((returnStat.reverse()), document.getElementById("feed"));
        }
        catch (e) {
            return;
        }
    }


    const addFollower = async event => {

        var res = [];
        var body = '{"femaleUsername": "' + followerIn.value + '", "maleId": "' + userid + '"}';

        try {
            if (followerIn.value == login)
                alert("You can't follow yourself you stupid fuck.");
            else {
                const response = await fetch(BASE_URL + 'api/addFollow',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
                res = JSON.parse(await response.text());

                if (res.Status === 0) {
                    // Failed to follow
                    alert('Please Search A UserName on OnlySocks');
                } else {
                    // Success at follow
                    alert('Yay! Followed!');
                    refreshFollowing();

                }
            }

        }
        catch (e) {
            return;
        }

    }

    const refreshFollowing = async event => {
        var res = [];
        var body = '{"userId": "' + userid + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/addFollow',
                { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
            res = JSON.parse(await response.text());

            following = res.Following;

        }
        catch (e) {
            return;
        }
    }



    return (
        <div>
            <div id="mainUI" className="mainInterface" onLoad={getStatuses}>
                <div id="sidediv" className="sidediv">
                    <div id="logedinName" className="headerMain">
                        <span id="userName">
                            <b> Welcome to OnlySocks {firstName} {lastName}!</b>
                            <img src={logo} className="App-logo-small" alt="logo" />
                        </span>
                    </div>
                    <div className="user">
                        <div className="thisis" >This is OnlySocks, You may only post sock-related content.</div>
                        <button className="navbutton" onClick={goHome}><FontAwesomeIcon icon={['fas', 'home']} size="sm" style={{ color: 'white' }} transform="up-1" />&nbsp; Home</button>
                        <button className="navbutton" onClick={getProfileView}><FontAwesomeIcon icon={['fas', 'user']} size="sm" style={{ color: 'white' }} transform="up-1" />&nbsp; Profile</button>
                        <button className="navbutton" onClick={getFollowersView}><FontAwesomeIcon icon={['fas', 'users']} size="sm" style={{ color: 'white' }} transform="up-1" />&nbsp; Follow</button>
                        <div className="userprofilepic">
                            <ProfileImageUploader pictureName={profilePicture} userId={userid} />
                        </div>
                        <div className="uploadfavsocks">
                            <span className="favSocks" >Favorite pair of socks: </span>
                            <ImageUploadFavSocks pictureName={favSocks} userId={userid} />
                        </div>
                    </div>
                    <div>
                        <button type="button" id="logoutButton" className="logoutbut" onClick={doLogout} >
                            <FontAwesomeIcon icon={['fas', 'sign-out-alt']} size="sm" style={{ color: 'white' }} transform="" />
                            <b>&nbsp; Sign Out</b>
                        </button>
                    </div>
                    {}
                </div>

                <div id="Profile" className="statusContent">
                    <div id="change">
                        <div className="mainContentHead">
                            <div className="wrapperhead">
                                <div className="location">
                                    <span className="headingdivmain"><b>Profile</b></span>
                                </div>
                                <div className="promptmodal">
                                    <button className="statusupdate" onClick={openStatModal}>
                                        What's on your mind...(about socks though...)?
                                    </button>
                                    <button className="writebutton" onClick={openStatModal} >
                                        <FontAwesomeIcon icon={['fas', 'edit']} size="2x" style={{ color: 'black' }} transform="down-2" />
                                    </button>
                                </div>
                                <div id="nobackdrop" className="nobackdrop">
                                    <div className="modalstatus">
                                        <div id="statusupdatemodal">
                                            <b><span className="pad">Create Post</span></b>
                                            <hr className="smol"></hr>
                                            <div className="statuseditor">
                                                <QuillEditor id="editor" className="editor" />
                                            </div>
                                            <div className="statusbuttons">
                                                <hr className="smol"></hr>
                                                <button className="statbutton" onClick={closeStatModal}>
                                                    <b>Cancel</b>
                                                </button>
                                                <button className="statbutton" onClick={postStatuses}>
                                                    <b>Send into the Sockiverse</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="horizlinemain"></hr>
                        </div>

                        <div className="statusdiv">
                            <div className="sockicon">
                            </div>
                            <div id="statusandupload">
                                <input id="fileupload" className="filein" type="file" name="name"></input>
                            </div>
                        </div>
                        <div id="feed" className="feedcontainer">
                        </div>
                    </div>
                </div>
                <div>
                    {}
                </div>
            </div>
        </div>
    );

}
export default Profile;


function containsSocks(textineditor) {
    var sockVarients = ['socks', 'Socks', 'soxs', 'sox', 'sock', 'Sock', '#socks', '#Socks', '#sock', '#Sock'];
    var i;
    for (i = 0; i < sockVarients.length; i++) {
        if (textineditor.includes(sockVarients[i]))
            return true;
    }
    return false;
}