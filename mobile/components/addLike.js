// import { post } from 'jquery';

import { Alert } from 'react-native';

// const configData = require('./config.json');
// const BASE_URL = configData.ip;
const BASE_URL = 'https://onlysocks.herokuapp.com/';

const likePressed = async (postId, userId) => {

        // console.log("SUPPP WORLD");

        

        var js = '{"postid": "' + postId + '", "userid": "' + userId + '"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/addLike',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            var numOfLikes = res.numOfLikes;
            
            if( res.Status === 0 )
            {
                // Not liked
                Alert.alert("Not Liked");
                return {status: 0, numOfLikes: numOfLikes};
                // likePressed = 0;
            }
            else if( res.Status === 1 )
            {
                // Liked
                Alert.alert("Liked");
                numOfLikes = numOfLikes + 1;
                return {status: 1, numOfLikes: numOfLikes};
                // likePressed = 1;
            }
            else
            {
                // Already Liked
                Alert.alert("Already Liked. Unliking...");
                numOfLikes = numOfLikes - 1;
                return {status: 2, numOfLikes: numOfLikes};
                // likePressed = 2;
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }   
}
export default likePressed;