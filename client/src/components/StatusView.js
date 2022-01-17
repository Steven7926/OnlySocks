import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles/LoginMain.css';
import './styles/CustomScroll.css';
import likePressed from './addLike';
import Parser from 'html-react-parser';
import './fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuillEditor from './QuillEditor';
var commentMessage = {};
var myList = ['eggs, bacon, milk'];
var thisComment = '';
var newComments = [];
var newComments2 = {};

const configData = require('./config.json');
const BASE_URL = configData.ip;



class StatusView extends React.Component {

    

    constructor(props) {
        super(props);

        newComments2[this.props.commentCounter] = [];

        this.comments = [];
        this.usernames = [];
        if(this.props.comments === undefined || this.props.comments.length == 0){
            }
        else{
            for(let i = 0; i < this.props.comments.length; i++){
                var commentObj = {"comment": this.props.comments[i].comment , "username": this.props.comments[i].username};
                this.comments.push(commentObj);

            }
        }
        thisComment = this.props.commentCounter;
    }

    async openStatModal(id){
        var modal = document.getElementById(id);
        modal.classList.remove("nobackdrop2");
        modal.classList.add("backdrop2");
    }
    async closeStatModal(id){
        var modal = document.getElementById(id);
        modal.classList.remove("backdrop2");
        modal.classList.add("nobackdrop2");
    }

    async handleClick(postid, userid, buttonCounter) {
        var status, numOfLikes = await likePressed(postid, userid);
        var elem = document.getElementById(buttonCounter);
        if (status === 0) {
            var renderButton = <span><FontAwesomeIcon icon={['fas', 'heart']} size='sm' style={{ color: 'white' }} transform='up-1' />&nbsp; Like: {numOfLikes} </span>
            ReactDOM.render(renderButton, elem);
        } else if (status === 1) {
            renderButton = <span><FontAwesomeIcon icon={['fas', 'heart']} size='sm' style={{ color: 'white' }} transform='up-1' />&nbsp; Like: {numOfLikes} </span>
            ReactDOM.render(renderButton, elem);
        } else {
            renderButton = <span><FontAwesomeIcon icon={['fas', 'heart']} size='sm' style={{ color: 'white' }} transform='up-1' />&nbsp; Like: {numOfLikes} </span>
            ReactDOM.render(renderButton, elem);
        }
    }

    async doUser(userId)
    {
        
        try {
            
            var res = [];
            var js = '{"userid": "' + userId + '}';

            const response = await fetch(BASE_URL + 'api/getUsername',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            res = JSON.parse(await response.text());

            if (res.Status === 0) {
                // Username found
                return res.username;
            } else {
                // Username not found

            }

        } catch (error) {
            
        }
    }

    async handleCommentLoad(idCount) {
        try {
            var elem = document.getElementById(idCount);
            var reRender = <div>{this.comments.map((comment) => <div style={{ marginLeft: '4%' }}>{comment.username + ": " + comment.comment}<hr className = "stathr" /></div>)}</div>
            ReactDOM.render(reRender, elem);
            const [message, setMessage] = useState('');
            ReactDOM.render(<div>{message}</div>, elem);
        } catch (error) {
            
        }
        
    }
    async handleAddComment() 
    {
        if(commentMessage[this.props.buttonCounter].value.length <= 0)
        {
            alert("Comment not long enough");
            return;
        }
        var js = '{"postId": "' + this.props.postid + '", "userId": "' + this.props.userid + '", "comment": "' + commentMessage[this.props.buttonCounter].value + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/addComment',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if(res.Status === 0)
            {
                // Error adding comment
                alert("Error adding comment");
            } else if(res.Status === 1)
            {
                // Comment added
                var elem = document.getElementById(this.props.commentCounter + "2");
                console.log(newComments2.length);
                newComments2[this.props.commentCounter].push(this.props.loggedInUsername + ": " + commentMessage[this.props.buttonCounter].value);
                ReactDOM.render(<div style={{ fontSize: 'medium', marginLeft: '4%' }}>
                                        {newComments2[this.props.commentCounter].map((ele) =>                                       
                                        <div>                                           
                                            {ele}
                                            <hr className="stathr" />
                                        </div>)}                                 
                                </div>, elem);
                commentMessage[this.props.buttonCounter].value = "";
            }
            else
            {
                // Post not found
                alert("Post not found");
            }
            } catch (error) {
                console.log(error);
            }
        
    }

    render() {
        return (
            <div className='divstatus' >

                {}
                {}
                {}


                <div className="marginleft">
                    <span className="mediumfont">
                        <b> {this.props.user} </b>
                    </span>
                    <hr className='stathr' />
                    <div className="marginstat">
                        {Parser(this.props.status)}
                    </div>
                    <hr className='stathr' />
                    <div className="commentinput">
                        <div>
                            <div style={{ marginBottom: '1%' }}>
                                <div  style={{marginLeft: '-1vh'}}>
                                    <input id={this.props.commentBox} className='comment' placeholder='  Write something...' ref={(c) => commentMessage[this.props.buttonCounter] = c}></input>
                                    <button id={"addComment" + this.props.buttonCounter} className='commentbutton' onClick={() => { this.handleAddComment() }} >
                                        <FontAwesomeIcon icon={['fas', 'paper-plane']} size="sm" style={{ color: 'white' }} transform="up-1" />
                                        <span>&nbsp; Send Comment</span>
                                    </button>
                                    <button id={this.props.buttonCounter} className='likebutton' onClick={() => { this.handleClick(this.props.postid, this.props.userid, this.props.buttonCounter) }} >
                                        <FontAwesomeIcon icon={['fas', 'heart']} size="sm" style={{ color: 'white' }} transform="up-1" />
                                        <span> &nbsp; Like: {this.props.likes} </span>
                                    </button>      
                                </div>                                                                             
                            </div>     
                        </div>

                        <div id = "comments" style={{ overflow: 'auto'}}>
                            <div style={{ marginBottom: '1%', fontSize: 'medium', fontWeight: 'bold' }}>
                                Comments:
                            </div>
                            <div id={this.props.commentCounter} className = "commenting" style={{ fontSize: 'medium', overflow: 'auto' }}>{this.handleCommentLoad(this.props.commentCounter).toString()}</div>
                            <div id={this.props.commentCounter + "2"}></div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }
} export default StatusView;