import React, { useState, Component , useEffect} from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity, Settings, ScrollView, TouchableHighlight } from 'react-native';
import { WebViewQuillEditor, WebViewQuillViewer } from 'react-native-webview-quilljs';
import styles from './styles/styles';
import { parse } from 'node-html-parser';
import DOMParser from 'react-native-html-parser';
import HTML from 'react-native-render-html';
import likePressed from './addLike';
import commentAdded from './addComment';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faSignature, faTerminal, faEnvelope, faSearch, faPaperPlane, fas, faUsers, faUserShield, faWindowClose, faComment } from '@fortawesome/free-solid-svg-icons'

var numOfLikes;
var key = 0;
var newComments = {};

// var newComments = [];


 function commit() {
    
    const [modalOpen, setModalOpen] = useState(false);
    // Hook for Modal triggering
    const openCModalCommands = async event => {
        setModalOpen(true);
        setPostContent('');
        // console.log(userid);
    };
    
}

class StatusView extends React.Component {

    
    async openCModalCommands(state){
        this.setModalOpen = state;
    }
    // async openCModalCommandsClose(){
    //     this.setModalOpen = false;
    // }

   
    constructor(props) {
        super(props);
        newComments[this.props.newCommentsCounter] = [];
        // console.log(typeof(this.props.status));
        this.numOfLikes = this.props.likes;
        this.state = {textValue: ": " + (String(this.numOfLikes)),
                      PostContent: "",
                      refreshCount: 0};
        this.response = {modalVisible: false};
        this.modalVisible = false;
        this.comments = [];
        if(this.props.comments === undefined || this.props.comments.length == 0){
            // this.comments.push("");
            }
        else{
            for(let i = 0; i < this.props.comments.length; i++){
                // console.log(this.props.comments[i]);
                var commentObj = {"comment": this.props.comments[i].comment , "username": this.props.comments[i].username};
                this.comments.push(commentObj);
            }
            // console.log(this.comments);
        }
        // console.log(this.comments);
    }

    forceRemount = () => {
        this.setState(({ uniqueValue }) => ({
          uniqueValue: uniqueValue + 1
        }));
      }

    onButtonPress = () => {
        this.setState({
          textValue: ": " + String(this.numOfLikes)
        });
    }


    async handleClick(postid, userid) {
        var response = await likePressed(postid, userid);
        var status = response.status;
        this.numOfLikes = response.numOfLikes;
        
        this.onButtonPress();
    }

    async pushStuff(string){
        // console.log("hi");
    
        if(string === undefined)
        {
            // return;
            console.log("undefined");
        }
        else
        {
            // console.log(string);
            // newComments.push(string + '\n');
            newComments[this.props.newCommentsCounter].push(newComments[this.props.newCommentsCounter].length === 0 ? string : '\n' + string);
        }
        
    }

    async handleComment(postId, userId, comment) {
        
        // console.log(this.state.newComment === undefined);
        // this.setState({modalVisible:state});
        if(comment == 0)
        {
            Alert.alert('Check Comment not long enough!');
        }
        
        //console.log("hello");
        this.setModalVisible(!this.modalVisible)
        //console.log("---------");
        //console.log("postId: " + postId + "\nuserId: " + userId + "\ncomment: " + comment);
        var response = await commentAdded(postId, userId, comment)
        var status = response.status;
        //console.log("Status: " + status);
        //console.log(response);
        this.forceRemount();
        this.onButtonPress();
        this.pushStuff(this.props.currentUser + ": " + comment);
        this.setState({newComment: this.props.currentUser + ": " + comment});
        
        // useEffect(() => {getStatuses()}, [])
    }
     
      setModalVisible(visible) {
        this.setState({PostContent: ""});
        this.setState({modalVisible: visible});
        this.modalVisible = visible;
        //console.log(this.modalVisible);
      }
      
    render(){
        return(
        <View style={styles.statusContainer}>
            <View style={styles.rowName}>
            {/* <Image style={styles.profileTweetAvatar} source={{uri: this.props.profilePic}}/> */}
                <Text style={{ fontWeight: 'bold' }}>{this.props.user}</Text>
            </View>
            <View style={styles.simHr} />

            <View style={styles.rowStatus}>
                <HTML html={this.props.status}/>
            </View>
            <View style={styles.simHr} />
            <View style={styles.rowComment}>
            <Text style={{ fontWeight: 'bold' }}>Comments:</Text>
            <View>
                 <View style={styles.simHrcom} />
                {this.comments.map((comment) => <Text key={(key++).toString()}>{comment.username + ": " + comment.comment}</Text>)}
                {newComments[this.props.newCommentsCounter].length === 0 ? console.log() : <Text>{newComments[this.props.newCommentsCounter]}</Text>}
            </View>
        </View>


            <View style={styles.rowLikeComment}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            style={styles.commentbutton}
                            activeOpacity={.5}
                            onPress={() => {this.setModalVisible(true)}}
                            // onPress={() => {
                            //     this.handleComment()
                            // }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <FontAwesomeIcon icon={faComment} size={20} style={{ color: '#ffffff' }} />
                                <Text style={{color: 'white'}}> Leave Em a Good Response</Text>
                            </View>
                        </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.likeButton}
                        activeOpacity={.1}
                        onPress={() => {
                            this.handleClick(this.props.postid, this.props.userid);
                            }}
                        >
                            <FontAwesomeIcon icon={faHeart} size={30} style={{ color: '#c66156', }} />
                    </TouchableOpacity>
                   
                </View>
                    <View style={styles.likeNum}>
                        <TouchableOpacity
                            style={styles.likes}
                            color="#dbdbdb"
                            onPress={() => {
                                this.handleClick(this.props.postid, this.props.userid);
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{this.state.textValue}</Text>
                        </TouchableOpacity>

                </View>
            </View>
            <Modal
              visible={this.modalVisible}
              animationType={'slide'}>
                    <View style={styles.createPostContainer}>
                        <View style={{ flexDirection: 'column', flex: 1, marginTop: 100, justifyContent: 'space-between' }}>
                            <TextInput
                                placeholder=" Tell em what's good with their sock game..."
                                onChangeText={text => this.setState({ PostContent: text })}
                                //value={postContentValue}
                                underlineColorAndroid="transparent"
                                style={styles.postInput}
                            />
                            <View style={{ flex: 1, flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ width: 150, marginLeft: 30 }}>
                                    <TouchableOpacity
                                        style={styles.postbutton}
                                        activeOpacity={.5}
                                        onPress={() => { this.setModalVisible(!this.modalVisible) }}
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
                                        onPress={() => { this.handleComment(this.props.postid, this.props.userid, this.state.PostContent) }}
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
} export default StatusView;

// class StatusView extends React.Component {

//     constructor(props) {
//         super(props);
//         // this.handleClick = this.handleClick.bind(this.props.postid, this.props.userid, this.props.likes);
//         // console.log("likes: " + this.props.likes + "postid: " + this.props.postid + "userid: " + this.props.userid);
//     }

//     async handleClick(postid, userid) {
//         // console.log("likes: " + theProp.likes + "postid: " + postid + "userid: " + userid);
//         var status, numOfLikes = await likePressed(postid, userid);
//         console.log(status);
//         var elem = document.getElementById("likeButton");
//         if(status === 0)
//         {
//             elem.innerHTML = "<span><FontAwesomeIcon icon={['fas', 'heart']} size='sm' style={{ color: 'white' }} transform='up-1' /> &nbsp; Like: " + (numOfLikes) + "</span>";
//         }else if (status === 1)
//         {
//             elem.innerHTML = "<span><FontAwesomeIcon icon={['fas', 'heart']} size='sm' style={{ color: 'white' }} transform='up-1' /> &nbsp; Like: " + (numOfLikes) + "</span>";
//             numOfLikes = 1 + numOfLikes;
//         } else 
//         {
//             elem.innerHTML = "<span><FontAwesomeIcon icon={['fas', 'heart']} size='sm' style={{ color: 'white' }} transform='up-1' /> &nbsp; Like: " + (numOfLikes) + "</span>";
//             numOfLikes = numOfLikes - 1;
//         }
        
//         // alert("likes: " + likes + "postid: " + postid + "userid: " + userid);
//         // elem.innerHTML = "Liked: " + (1 + likes);
//         // alert(likes2);
        
//     }

//     render() {
//         return (
//             <div className='divstatus'>
//                 <div className= "marginleft">
//                     <span className = "mediumfont">
//                         <b> {this.props.user} </b>
//                     </span>
//                     <hr className='stathr' />
//                     <div className = "marginstat">
//                         { Parser(this.props.status) }
//                     </div>
//                     <hr className='stathr' />
//                     <div className = "commentinput">
//                         <input className='comment' placeholder='  Write something...'></input>
//                         <button id="likeButton" className='likebutton' onClick={() => { this.handleClick(this.props.postid, this.props.userid) }} >
//                             <FontAwesomeIcon icon={['fas', 'heart']} size="sm" style={{ color: 'white' }} transform="up-1" />
//                             &nbsp; Like: {this.props.likes}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// } export default StatusView;