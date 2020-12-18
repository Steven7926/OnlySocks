import React from 'react';
import './styles/LoginMain.css';
import './fontawesome';



const configData = require('./config.json');
const BASE_URL = configData.ip;


class FollowView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isFollowing2: this.props.isFollowing };
    }

    async handleFollowClick() {
        if (this.state.isFollowing2 == "Follow") {

            var res = [];
            var body = '{"femaleUsername": "' + this.props.user + '", "maleId": "' + this.props.loggeduserid + '"}';

            try {
                const response = await fetch(BASE_URL + 'api/addFollow',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
                res = JSON.parse(await response.text());

                if (res.Status === 0) {
                    // Username found

                } else {
                    // Username not found

                    var res2 = [];
                    var body2 = '{"username": "' + this.props.user + '"}';
                    const response2 = await fetch(BASE_URL + 'api/getUserId',
                        { method: 'POST', body: body2, headers: { 'Content-Type': 'application/json' } });
                    res2 = JSON.parse(await response2.text());

                    var buffer = localStorage.getItem('user_following');
                    var buffer2 = buffer.split(',');
                    buffer2.push(res2.userId);

                    localStorage.setItem('user_following', buffer2.join(','));

                }
                var newfollowbutval = document.getElementById(this.props.followbuttonid);
                newfollowbutval.innerHTML = "Following";
                this.state = { isFollowing2: "Following" };
            }
            catch (e) {
                alert(e.toString());
                return;
            }

        }
        else {
            var res = [];          
            try {

                var res2 = [];
                var body2 = '{"username": "' + this.props.user + '"}';
                const response2 = await fetch(BASE_URL + 'api/getUserId',
                    { method: 'POST', body: body2, headers: { 'Content-Type': 'application/json' } });
                res2 = JSON.parse(await response2.text());
                
                var body = '{"femaleId": "' + res2.userId + '", "maleId": "' + this.props.loggeduserid + '"}';
                const response = await fetch(BASE_URL + 'api/unFollow',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
                res = JSON.parse(await response.text());

                if (res.Status === 0) {
                    // Username found

                   

                } else {
                    // Username not found
                    

                    var buffer = localStorage.getItem('user_following');
                    
                    var buffer2 = buffer.split(',');
                    var buffer3 = [];
                    for(let k = 0; k < buffer2.length; k++)
                    {
                        if(buffer2[k] != res2.userId)
                        {
                            buffer3.push(buffer2[k]);
                        }
                    }

                    localStorage.setItem('user_following', buffer3.join(','));

                }
                var newfollowbutval = document.getElementById(this.props.followbuttonid);
                newfollowbutval.innerHTML = "Follow";
                this.state = { isFollowing2: "Follow" };
            }
            catch (e) {
                alert(e.toString());
                return;
            }
        }

    }

    render() {
        return (
            <div className={this.props.class} id={this.props.followid}>
                <div style={{ fontSize: 'xx-large', float: 'left', width: '20vh' }}>
                    <div style={{ color: 'white', marginLeft: '2vh', marginTop: '5px' }}>
                        <b> {this.props.user} </b>
                    </div>
                </div>
                <div>
                    <button className={this.props.classbut} id={this.props.followbuttonid} onClick={() => { this.handleFollowClick() }}>{this.props.isFollowing}</button>
                </div>
            </div>
        );
    }
} export default FollowView;