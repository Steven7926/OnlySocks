import React from "react";
import './fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
var AWS = require('aws-sdk');
const fs = require('fs')

var blankImage = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
var hideButton = false;
var removeBut = 'addpicbutton';

const configData = require('./config.json');
const BASE_URL = configData.ip;

const defaultPic = "https://onlysocks.s3.amazonaws.com/ProfilePictures/blank.png";
const baseURLImage = "https://onlysocks.s3.amazonaws.com/ProfilePictures/";

class ProfileImageUploader extends React.Component {
    
    constructor(props) {
        super(props);
        if(this.props.pictureName != defaultPic)
        {
            hideButton = true;
            removeBut = 'addpicbuttonremoved';
        }
        console.log(this.props.pictureName);
        this.state = { image: this.props.pictureName };
        this.onChange = this.onChange.bind(this);
        this.resetFile = this.resetFile.bind(this);
    }
    onChange(event) {

        var fileName = event.target.files[0].name;

        let reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () => {

            let body = '{"userId":"'
                + this.props.userId
                + '","profilePicture":"'
                + fileName
                + '","theFile":"'
                + reader.result
                + '"}'; 

        
            try {
                const response = fetch(BASE_URL + 'api/addNewProfilePicture',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
            }
            catch (e) {
                alert(e.toString());
                return;
            }

            this.setState({
                image: reader.result
            });
            localStorage.setItem('user_pfp', reader.result);
        };
        
        
    }

    resetFile(event) {
        event.preventDefault();
        this.setState({ file: defaultPic });
    }

    addProfilePic() {    
        document.getElementById('profileinput').click();        
    }

    

    render() {
        return (
            <div className="overallprofile">
                <div className = "overlaybutton">
                    
                </div>
                <input id= "profileinput" type="file" onChange={this.onChange} style={{ display: "none" }} />
                
                    <div style={{ textAlign: "center" }}>
                        <button className="removeButton" onClick={this.addProfilePic}>
                            <FontAwesomeIcon icon={['fas', 'edit']} size="sm" style={{ color: 'white' }} transform="right-1 up-1" />
                        </button>
                    </div>
                <div>
                    <img id="profilepic" className="profilesizing" src={this.state.image} />
                </div>
            </div>
        );
    }
} 
export default ProfileImageUploader;