import React from 'react';
import ReactDOM from 'react-dom';
import './styles/LoginMain.css';
import logo from './styles/sock@3x.png';
import './fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageUploadFavSocks from './ImageUploadFavSocks';
import ProfileImageUploader from './ProfileImageUploader';
import FollowView from './FollowView';

const configData = require('./config.json');
const BASE_URL = configData.ip;
var userswhofollow = [];
var userswhoarefollowing = [];
var userswhoarefollowingid = [];

function Following() {

    var numoffollowers = 0;
    var numoffollowing = 0;
    var followbutid = 0;

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var userid = ud.id;
    var login = ud.username;
    var following = ud.following;
    var profilePicture = localStorage.getItem('user_pfp');
    var favSocks = localStorage.getItem('user_favSocks');

    var searchusertext;

    const doLogout = event => {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };


    const openStatModal = () => {
        var modal = document.getElementById("nobackdrop");
        modal.classList.remove('nobackdrop');
        modal.classList.add('backdrop');
    }
    const closeStatModal = () => {
        window.location.href = '/onlysocks/following';
    }

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

    const searchUser = async event => {
        var res = [];
        var body = '{"username": "' + searchusertext.value + '", "loggeduser": "' + login + '"}';
        var users = [];
        var returnview = [];
        var followbutval;
        try {
            const response = await fetch(BASE_URL + 'api/getUsers',
                { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });

            res = JSON.parse(await response.text());

            for (var i = 0; i < res.length; i++) {
                users[i] = res[i].username;
                followbutval = isUserFollowing(users[i]);

                returnview[i] = <FollowView loggeduserid={userid} user={users[i]} userid={userswhoarefollowingid[i]} isFollowing={followbutval} class={"searchfollowpeeps"} classbut={"searchfollowButton"} followbuttonid={followbutid} />
                followbutid++;
            }
            ReactDOM.render(returnview, document.getElementById("returnFollow"));

        }
        catch (e) {
            return;
        }


    }

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
                returnview[i] = <FollowView loggeduserid={userid} user={userswhoarefollowing[i]} userid={res[i].userfollowingid} followid={"follow" + followid} isFollowing={"Following"} class={"followpeeps"} classbut={"followButton"} followbuttonid={followbutid} />
                followid++;
                followbutid++;
            }
            numoffollowing = res[res.length - 1].followingnum;

            ReactDOM.render(returnview, document.getElementById("following"));
            ReactDOM.render(numoffollowing, document.getElementById("numfollowing"));


        }
        catch (e) {
            return;
        }
        getFollowers();
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
                returnview[i] = <FollowView loggeduserid={userid} user={userswhofollow[i]} userid={res[i].userfollowingid} followid={"follow" + followid} isFollowing={followbutval} class={"followpeeps"} classbut={"followButton"} followbuttonid={followbutid} />

                followid++;
                followbutid++;
            }
            numoffollowers = res[res.length - 1].followernum;

            ReactDOM.render(returnview, document.getElementById("followers"));
            ReactDOM.render(numoffollowers, document.getElementById("numfollowers"));
        }
        catch (e) {
            return;
        }
    }

    return (
        <div>
            <div id="mainUI" className="mainInterface" onLoad={getFollowing}>
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

                </div>



                <div id="Following" className="statusContent">

                    <div id="nobackdrop" className="nobackdrop">
                        <div className="modalfollow">
                            <div id="statusupdatemodal">
                                <div className="modalHead">
                                    <b>Search for a Fellow Socker</b>
                                </div>
                                <hr className="following"></hr>
                                <div className="statuseditor">
                                    <input id="searchusertext" className="searchforfollow" placeholder="Username..." ref={(c) => searchusertext = c}>
                                    </input>
                                    <button className="writebutton" onClick={searchUser} >
                                        <FontAwesomeIcon icon={['fas', 'search']} size="2x" style={{ color: 'black' }} transform="down-2" />
                                    </button>
                                    <button className="backtofollow" onClick={closeStatModal}>
                                        <b>Back to Followers</b>
                                    </button>
                                </div>
                                <div className="followSearchScroll">
                                    <div id="returnFollow">
                                    </div>
                                </div>
                                <div className="statusbuttons">
                                    <div>
                                        <hr className="following"></hr>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="change">
                        <div className="mainContentHead">
                            <div className="wrapperhead">
                                <div className="location">
                                    <span className="headingdivmain"><b>Follow</b></span>
                                </div>
                                <div className="promptmodal">
                                    <button className="statusupdate" onClick={openStatModal}>
                                        Search for fellow sockpeeps...?
                                    </button>
                                    <button className="writebutton" onClick={openStatModal} >
                                        <FontAwesomeIcon icon={['fas', 'search']} size="2x" style={{ color: 'black' }} transform="down-2" />
                                    </button>
                                </div>
                            </div>
                            <hr className="horizlinemain"></hr>
                        </div>
                    </div>


                    <div id="feed" className="feedcontainer">
                        <div className="followScroll">
                            <div className="Following">
                                <b>Following: <span id="numfollowing"></span></b>
                            </div>
                            <div className="Followers">
                                <b>Followers:  <span id="numfollowers"></span> </b>
                            </div>

                            <div id="following" className="followingScroll">

                            </div>

                            <div id="followers" className="followersScroll">

                            </div>


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
export default Following;

function isUserFollowing(userwhofollows) {

    if (userswhoarefollowing.includes(userwhofollows))
        return ("Following");
    else
        return ("Follow");
}