// import Parser from 'html-react-parser';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity, Settings, ScrollView, RefreshControl, Dimensions } from 'react-native';
import styles from './styles/styles'
import AsyncStorage from '@react-native-community/async-storage';


const configData = require('./config.json');
//const BASE_URL = configData.ip;
const BASE_URL = 'https://onlysocks.herokuapp.com/'; // server ip: 54.146.57.74


class FollowView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        textValue: this.props.isFollowing
    }

    async handleFollowClick() {
        if (this.props.isFollowing == "Follow") {

            var res = [];

            // var body = {femaleId: followerIn.value, maleId: userid}
            var body = '{"femaleUsername": "' + this.props.user + '", "maleId": "' + this.props.loggeduserid + '"}';

            try {
                const response = await fetch(BASE_URL + 'api/addFollow',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
                res = JSON.parse(await response.text());

                if (res.Status === 0) {
                    // Username found
                    // console.log(this.props.followList);
                } else {
                    // Username not found

                    var res2 = [];
                    var body2 = '{"username": "' + this.props.user + '"}';
                    const response2 = await fetch(BASE_URL + 'api/getUserId',
                        { method: 'POST', body: body2, headers: { 'Content-Type': 'application/json' } });
                    res2 = JSON.parse(await response2.text());



                    // console.log(this.props.followList);
                    var buffer = this.props.followList;
                    buffer.push(res2.userId);
                    var userFollowing = { following: buffer }
                    AsyncStorage.setItem('user_following', JSON.stringify(userFollowing));

                }
                Alert.alert("Followed", "You have followed " + this.props.user + ". Take solace in the sockitude that they may share.");
                this.setState({
                    textValue: 'Following'
                })
            }
            catch (e) {
                alert(e.toString());
                return;
            }


        }
        else {
            var res = [];
            // var body = {femaleId: followerIn.value, maleId: userid}
            
            

            try {

                var res2 = [];
                var body2 = '{"username": "' + this.props.user + '"}';
                const response2 = await fetch(BASE_URL + 'api/getUserId',
                    { method: 'POST', body: body2, headers: { 'Content-Type': 'application/json' } });
                res2 = JSON.parse(await response2.text());
                // console.log(res2.userId);

                var body = '{"femaleId": "' + res2.userId + '", "maleId": "' + this.props.loggeduserid + '"}';
                const response = await fetch(BASE_URL + 'api/unFollow',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
                res = JSON.parse(await response.text());

                if (res.Status === 0) {
                    // Username found
                    
                } else {
                    // Username not found




                    // console.log(this.props.followList);
                    var buffer = this.props.followList;
                    // buffer.push(res2.userId);
                    var buffer3 = [];
                    for (let k = 0; k < buffer.length; k++) {
                        if (buffer[k] != res2.userId) {
                            buffer3.push(buffer[k]);
                        }
                    }
                    var userFollowing = { following: buffer3 }
                    AsyncStorage.setItem('user_following', JSON.stringify(userFollowing));

                }
                Alert.alert("Unfollowed", "You have unfollowed " + this.props.user + ". May you forever miss their dope socks...");
                this.setState({
                    textValue: 'Follow'
                })

            }
            catch (e) {
                alert(e.toString());
                return;
            }
        }

    }

    render() {
        return (
            <View style={{ marginTop: 15, marginLeft: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 30, color: 'white' }}>{this.props.user}</Text>
                    <View style={{ marginLeft: 'auto' }}>
                        <TouchableOpacity
                            id={this.props.followbuttonid}
                            style={styles.followbut}
                            activeOpacity={.5}
                            onPress={() => { this.handleFollowClick() }}
                        >
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> {this.state.textValue}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.simHrfollow}></View>
            </View>
        );
    }
} export default FollowView;