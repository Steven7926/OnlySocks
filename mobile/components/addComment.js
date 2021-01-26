// import { post } from 'jquery';

import { Alert } from 'react-native';

// const configData = require('./config.json');
// const BASE_URL = configData.ip;
const BASE_URL = 'https://onlysocks.herokuapp.com/';

const commentAdded = async (postId, userId, comment) => {

        // console.log("SUPPP WORLD");

        

        var js = '{"postId": "' + postId + '", "userId": "' + userId + '", "comment": "' + comment + '"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/addComment',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res.Status === 0 )
            {
                // Not liked
                return {status: 0};
                // likePressed = 0;
            }
            else if( res.Status === 1 )
            {
                // Liked
                return {status: 1};
                // likePressed = 1;
            }
            else
            {
                // Already Liked
                return {status: 2};
                // likePressed = 2;
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }   
}
export default commentAdded;