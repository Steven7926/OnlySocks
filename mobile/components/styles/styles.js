import React from 'react';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#323846',
        paddingTop: 100,
        paddingRight: 20,
        paddingLeft: 20,
        paddingHorizontal: 20
    },
    feedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#323846',
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingHorizontal: 20
    },
    statusContainer: {
        backgroundColor: '#dbdbdb',
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 20,
        flex: 1
    },

// Status Styling
    rowName: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: 10,
        //justifyContent: 'space-between',
    },
    rowStatus: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between'
    },
    rowLikeComment: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },
    rowComment: {
        padding: 10,
        paddingLeft: 30,
    },
    profileText: {
        
    },

    simHr: {
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
    },

    simHrfollow: {
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        marginRight: 10,
        borderRadius: 20,
        marginTop: 15
    },

    simHrcom: {
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        borderRadius: 20,
    },

    likeButton: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 35,
        backgroundColor: '#dbdbdb',
        borderRadius: 10,
        position: "relative",
    },

    likes: {
        
    },

    likeNum: {
        marginRight: 20,
        paddingRight: 10
    },
// End 
    testerrr: {
        width: 299,
        height: 136,
        backgroundColor: "#E6E6E6",
        borderRadius: 15,
        marginTop: 145,
        alignSelf: "center"
    },
    signupcontainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#323846',
        paddingTop: 20
    },
    createPostContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#323846',
        paddingTop: 20
    },
    userInputs: {
        color: "#ffffff",
        height: 40,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        textAlign: 'center'
    },
    postInput: {
        color: "#ffffff",
        height: 160,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        textAlign: 'center'
    },
    submitButtonStyle: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#c66156',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
        position: "absolute",
        bottom: 20,
        right: 20
    },
    submitProfileButtonStyle: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#c66156',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
        position: "absolute",
        bottom: 20,
        right: 0
    },
    navigationbuttons: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#323846',
        paddingTop: 100
    },
    logoText: {
        marginVertical: 15,
        fontSize: 40,
        color: 'white',
        textAlign: 'center'
    },
    userInputs: {
        color: "#ffffff",
        height: 40,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        textAlign: 'center'
    },
    //profile styling
    profileContainer: {
        flex: 1,
        backgroundColor: '#323846',
        paddingTop: 10,
        paddingHorizontal: 20
    },
    profileAvatar: {
        width: 130,
        height: 130,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: "white",
        marginTop: 20
    },
      profileName:{
        fontSize:30,
        color:"#FFFFFF",
        fontWeight: 'bold'
      },
      profileBody:{
        marginTop:40,
      },
      profileBodyContent: {
        flex: 1,
        padding:30,
      },
      profileName:{
        fontSize:30,
        color: "#DDDDDD",
        fontWeight: "bold"
      },
      profileTweetAvatar:{
        width: 50,
        height: 50,
        borderRadius: 63
       //borderWidth: 1
        //borderColor: "white",
        //marginBottom:10,
        //alignSelf:'center',
        //position: 'absolute',
        //marginTop:130
      },
      profilePicker:{
        paddingBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchfollowcontainer: {
        flex: 1,
        backgroundColor: '#323846',
        paddingTop: 40,
        paddingRight: 20,
        paddingLeft: 20,
        paddingHorizontal: 20
    },
    followfollowing: {
        paddingTop: 30,
        paddingLeft: 30,
        flex: 1,
        flexDirection: "row"
    },
    following: {
        paddingTop: 20,
        paddingLeft: 10,
    },
    followers: {
        paddingTop: 20,
        paddingLeft: 10,
    },
    followerbutton: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25,
        width: 158,
        height: 90,
        backgroundColor: '#c66156',
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
        bottom: 20,
        right: 20
    },
    followstuff: {

    },
    postbutton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#c66156',
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
    },
    loginbut: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#c66156',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
    },
    followbut: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 15,
        backgroundColor: '#c66156',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
        width: 100,
    },

    closebutton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#c66156',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
        marginTop: 10
    },
    commentbutton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#c66156',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
    },
   
});
export default styles;