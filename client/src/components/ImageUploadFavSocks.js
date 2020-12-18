import React from "react";
import './fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

var blankImage = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
var mainAddClassName = "addfavsockbut";
var sockFrameClassName = "sockpicturesize";
var hasPic = false;

const configData = require('./config.json');
const BASE_URL = configData.ip;


class ImageUploadFavSocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { file: this.props.pictureName };
        this.onChange = this.onChange.bind(this);
        this.resetFile = this.resetFile.bind(this);
        if (this.state.file != blankImage) {
            mainAddClassName = "addfavsockbutremoved";
            sockFrameClassName = "sockpicturesizeshow"
            hasPic = true;
        }
    }

    onChange(event) {

        document.getElementById('favsocksupload').click();

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
                const response = fetch(BASE_URL + 'api/addNewFav',
                    { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } });
            }
            catch (e) {
                alert(e.toString());
                return;
            }

            this.setState({
                file: reader.result
            });
            localStorage.setItem('user_favSocks', reader.result);
        };
    }

    resetFile(event) {
        event.preventDefault();
        this.setState({ file: null });
        this.setState({});
    }
    render() {
        return (
            <div className="entirediv">
                <button id="favsockupload" className={mainAddClassName} onClick={addFavSocks}>
                    <FontAwesomeIcon icon={['fas', 'plus']} size="sm" style={{ color: 'white' }} transform="" />
                </button>
                <input id="favsocksupload" type="file" onChange={this.onChange} style={{ display: "none" }} />
                {hasPic && (
                    <div style={{ textAlign: "center" }}>
                        <button className="removeButtonfav" onClick={editButtonClick}>
                            <FontAwesomeIcon icon={['fas', 'edit']} size="sm" style={{ color: 'white' }} transform="right-1 up-1" />
                        </button>
                    </div>
                )}
                <div>
                    <img id="imagesock" className={sockFrameClassName} src={this.state.file} />
                </div>
            </div>
        );
    }
}
export default ImageUploadFavSocks;

function addFavSocks() {
    var button = document.getElementById('favsockupload');
    var picture = document.getElementById('imagesock');

    document.getElementById('favsocksupload').click();

    button.classList.remove('addfavsockbut');
    button.classList.add('addfavsockbutremoved');

    picture.classList.remove('sockpicturesize');
    picture.classList.add('sockpicturesizeshow');
}

function editButtonClick() {
    document.getElementById('favsocksupload').click();
}