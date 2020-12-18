

const configData = require('./config.json');
const BASE_URL = configData.ip;

const likePressed = async (postId, userId) => {

        // These are switched for a reason. We dont know why they are backwards so keep!
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
                return 0, numOfLikes;
            }
            else if( res.Status === 1 )
            {
                // Liked
                numOfLikes = numOfLikes + 1;
                return 1, numOfLikes;
            }
            else
            {
                // Already Liked
                numOfLikes = numOfLikes - 1;
                return 2, numOfLikes;
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }   
}
export default likePressed;