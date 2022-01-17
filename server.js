const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const randtoken = require('rand-token');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const mongo2 = require('mongodb');
const configData = require('./client/src/components/config.json');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const AWS = require('aws-sdk');

const BASE_URL = configData.ip;
const path = require('path');
const { getMaxListeners } = require('process');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

/////////////////////////////////////////
// Added for Heroku deployment.
const PORT = process.env.PORT || 5000;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '8mb', extended: true }));

/////////////////////////////////////////
// Added for Heroku deployment.
app.set('port', (process.env.PORT || 5000));

//////////////////////////////
// Allows cors to work with react
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

/////////////////////////////////////////
const MongoClient = require('mongodb').MongoClient;

const url = '';

const client = new MongoClient(url);
client.connect();

app.use(fileUpload());


///////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'client', 'public')));

///////////////////////////////////////////////////
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'))
});

///////////////////////////////////////////////////
// For signup API
app.post('/api/validateToken', async (req, res, next) => {
  // incoming: validationID
  // outgoing: status of whether or not the ID was found

  const { validationID } = req.body;

  const db = client.db();
  const results = await db.collection('Validations').find({ ValidationID: validationID }).toArray();

  var status = ""

  if (results.length > 0) {
    // Token is in the database
    status = 'found';
    var myquery = { ValidationId: validationID };
    var newvalues = { $set: { IsValid: 1 } };
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  }
  else {
    // Token is not in the database
    status = 'not found';
  }

  var ret = { status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////////////////
// For password reset code checker
app.post('/api/resetPasswordConfirmCode', async (req, res, next) => {
  // incoming: username, code, newPassword
  // outgoing: status of the password reset | 0 = code not found, 1 = password reset, 2 = right code but wrong username

  const { username, code, newPassword } = req.body;

  const db = client.db();
  const results = await db.collection('ResetCodes').find({ ResetCode: code }).toArray();

  var status = ""

  if (results.length > 0) {
    // Code found
    if (username === results[0]['Username']) {
      status = 1;

      status = 1;
      var myquery = { Login: username };
      var newvalues = { $set: { Password: newPassword } };
      db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("Password reset!");
      });

    } else {
      status = 2;
    }


  } else {
    // Code not found
    status = 0;
  }

  var ret = { status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////////////////
// For password reset email send
app.post('/api/resetPasswordSendEmail', async (req, res, next) => {
  // incoming: username
  // outgoing: status of the password reset email | 0 = username not found, 1 = email sent

  const { username } = req.body;

  var email;
  var resetCode = randtoken.generate(16);

  const db = client.db();
  const results = await db.collection('Users').find({ Login: username }).toArray();

  var status = ""

  if (results.length > 0) {
    // Username found
    status = 1;
    email = results[0]['Email'];

    // Add resetCode to database
    var myobj = { ResetCode: resetCode, Username: username };
    db.collection("ResetCodes").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("Reset code added to database!");
    });

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: 'classproject2345@gmail.com',
        pass: 'classproject1!'
      }
    }));

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"OnlySocks" <do-not-reply@onlysocks.com>', // sender address
      to: email, // list of receivers
      subject: "Password reset code!", // Subject line
      text: "Your code is " + resetCode, // plain text body
      html: "<p>Your code is " + resetCode + "</p>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  }
  else {
    // Username not found
    status = 0;
  }

  var ret = { status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////////////////
// For adding a new favorite sock
app.post('/api/addNewFav', async (req, res, next) => {
  // incoming: userId, profilePicture, theFile(base64)
  // outgoing: Status of adding the new picture to database | 0 = success, 1 = failure

  const { userId, profilePicture, theFile } = req.body;

  const baseURLImage = "https://onlysocks.s3.amazonaws.com/FavoriteSocks/";

  var dateNow = Date.now().toString();

  try {
    var FinalId = new mongo2.ObjectID(userId);
    var myquery = { _id: FinalId };
    var newvalues = { $set: { FavSockPicture: baseURLImage + dateNow + "-" + profilePicture } };
    const db = client.db();
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
    });

    AWS.config.update({
      accessKeyId: "accesskeyId", // Access key ID
      secretAccessKey: "secretaccesskey", // Secret access key
      region: "us-east-1" //Region
    })

    const s3 = new AWS.S3();

    // Binary data base64
    const fileContent = Buffer.from(theFile.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    // Setting up S3 upload parameters
    const params = {
      Bucket: 'onlysocks',
      Key: "FavoriteSocks/" + dateNow + "-" + profilePicture.toString(), // File name you want to save as in S3
      Body: fileContent,
      ContentType: theFile.split(',')[0].split(':')[1].split(';')[0],
      ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3.putObject(params, function (err, data) {
      if (err) {
        throw err;
      }
    });

    var ret = { status: 0 };
    res.status(200).json(ret);

  } catch (error) {

    console.log(error);
    var ret = { status: 1 };
    res.status(200).json(ret);

  }

});

///////////////////////////////////////////////////
// For adding a new profile picture
app.post('/api/addNewProfilePicture', async (req, res, next) => {
  // incoming: userId, profilePicture, theFile(base64)
  // outgoing: Status of adding the new picture to database | 0 = success, 1 = failure

  const { userId, profilePicture, theFile } = req.body;

  const baseURLImage = "https://onlysocks.s3.amazonaws.com/ProfilePictures/";

  var dateNow = Date.now().toString();

  try {
    var FinalId = new mongo2.ObjectID(userId);
    var myquery = { _id: FinalId };
    var newvalues = { $set: { ProfilePicture: baseURLImage + dateNow + "-" + profilePicture } };
    const db = client.db();
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
    });

    AWS.config.update({
      accessKeyId: "accessKeyId", // Access key ID
      secretAccessKey: "secretAccessKey", // Secret access key
      region: "us-east-1" //Region
    })


    // console.log(theFile);

    const s3 = new AWS.S3();

    // Binary data base64
    const fileContent = Buffer.from(theFile.replace(/^data:image\/\w+;base64,/, ""), 'base64');


    // Setting up S3 upload parameters
    const params = {
      Bucket: 'onlysocks',
      Key: "ProfilePictures/" + dateNow + "-" + profilePicture.toString(), // File name you want to save as in S3
      Body: fileContent,
      ContentType: theFile.split(',')[0].split(':')[1].split(';')[0],
      ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3.putObject(params, function (err, data) {
      if (err) {
        throw err;
      }
    });

    var ret = { status: 0 };
    res.status(200).json(ret);

  } catch (error) {

    console.log(error);
    var ret = { status: 1 };
    res.status(200).json(ret);

  }

});

//////////////////////////////////////////////////
// For saving post pictures
app.post('/api/addNewPic', async (req, res, next) => {
  // incoming: profilePicture, theFile(base64)
  // outgoing: Status of adding the new picture to database | 0 = success, 1 = failure

  const { profilePicture, theFile } = req.body;

  const baseURLImage = "https://onlysocks.s3.amazonaws.com/Pictures/";

  try {

    AWS.config.update({
      accessKeyId: "accessKeyId", // Access key ID
      secretAccessKey: "secretAccessKey", // Secret access key
      region: "us-east-1" //Region
    })

    const s3 = new AWS.S3();

    // Binary data base64
    const fileContent = Buffer.from(theFile.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    // Setting up S3 upload parameters
    const params = {
      Bucket: 'onlysocks',
      Key: "Pictures/" + profilePicture.toString(), // File name you want to save as in S3
      Body: fileContent,
      ContentType: theFile.split(',')[0].split(':')[1].split(';')[0],
      ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3.putObject(params, function (err, data) {
      if (err) {
        throw err;
      }
    });

    var ret = { status: 0 };
    res.status(200).json(ret);

  } catch (error) {

    console.log(error);
    var ret = { status: 1 };
    res.status(200).json(ret);

  }

});

///////////////////////////////////////////////////
// For signup API
app.post('/api/signUp', async (req, res, next) => {
  // incoming: First name, last name, login, password, email address
  // outgoing: status of signup

  const { login, password, firstName, lastName, email } = req.body;

  const db = client.db();
  const results = await db.collection('Users').find({ Login: login }).toArray();

  var blankImage = "https://onlysocks.s3.amazonaws.com/ProfilePictures/blank.png";
  var blankFavSock = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";



  var isValid = 0
  var validationId = randtoken.generate(16);

  if (results.length > 0) {
    status = 'User already taken!';
  }
  else {
    // Add credentials to the database here
    var myobj = { Login: login, Password: password, FirstName: firstName, LastName: lastName, Email: email, IsValid: isValid, ValidationId: validationId, ProfilePicture: blankImage, FavSockPicture: blankFavSock };
    db.collection("Users").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("User added!");
    });

    // Add validationid to database
    var myobj = { Login: login, ValidationID: validationId };
    db.collection("Validations").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("Validation token added to database!");
    });

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: 'classproject2345@gmail.com',
        pass: 'classproject1!'
      }
    }));

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"OnlySocks" <do-not-reply@onlysocks.com>', // sender address
      to: email, // list of receivers
      subject: "Please verify your email for OnlySocks!", // Subject line
      text: "http://onlysocks.org/" + "?validationId=" + validationId, // plain text body
      html: "<a href=" + "http://onlysocks.org/" + "?validationId=" + validationId + ">Your validation link</a>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    status = 'User added to database!';
  }

  var ret = { status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////
//For deleting a post

async function deleteFunction(postId, status = 0) {
  try {
    var FinalId = new mongo2.ObjectID(postId);
    var myquery = { _id: FinalId };
    const db = client.db();
    db.collection("Posts").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
    });
    // worked
    status = 1;
  }
  catch (e) {
    // didnt work
    status = 0;
    console.log(e);
  }
  return status;
}

app.post('/api/deleteAPost', async (req, res, next) => {
  // incoming: postId
  // outgoing: status of deletion | 0 = did not delete(error) , 1 = deleted

  const { postId } = req.body;

  var results = await deleteFunction(postId);

  var ret = { status: results };
  res.status(200).json(ret);

});

///////////////////////////////////////
//Create post API
app.post('/api/createPost', async (req, res, next) => {
  // incoming: userid, login, content
  // outgoing: status of post | 0 = not posted , 1 = posted , 2 = not enough content

  const { userid, login, content } = req.body;
  var status = 0;
  var numlikes = 0;


  try {

    if (content.length > 1) {

      const db = client.db();
      await db.collection('Posts').insertOne({ Userid: userid, LoginName: login, ContentPost: content, Likes: numlikes, LikedUsers: [], Comments: [] });
      status = 1; //posted

    }
    else
      status = 2; //not enough to be posted
  }
  catch (e) {
    console.log(console.type);
    status = 0; //not posted
  }

  var ret = { status: status };
  res.status(200).json(ret);

});

///////////////////////////////////////
//Deletes a comment
app.post('/api/deleteComment', async (req, res, next) => {
  // incoming: postId, commentId
  // outgoing: returns status of deletion | 0 = error or post not found, 1 = comment deleted

  var status = 0;

  try {
    const { postId, commentId } = req.body;
    var FinalId = new mongo2.ObjectID(postId);
    var finalCommentId = new mongo2.ObjectID(commentId);

    const db = client.db();
    const results = await db.collection('Posts').find({ _id: FinalId }).toArray();

    if (results.length > 0) {
      var myquery = { _id: FinalId };
      var newvalues = { $pull: { Comments: { _id: finalCommentId } } };
      db.collection("Posts").updateOne(myquery, newvalues, function (err, res) {
      });
      status = 1;
    }
    else {
      status = 0;
    }

  }
  catch (e) {
    console.log(e);
    status = 0;
  }

  var ret = { Status: status };
  res.status(200).json(ret);

});

///////////////////////////////////////
//Adds a comment
app.post('/api/addComment', async (req, res, next) => {
  // incoming: postId, userId(of who is commenting), comment | text of comment
  // outgoing: returns status of deletion | 0 = error adding comment, 1 = comment added, 2 = post not found

  var status = 0;

  try {
    const { postId, userId, comment } = req.body;
    var FinalId = new mongo2.ObjectID(postId);

    const db = client.db();
    const results = await db.collection('Posts').find({ _id: FinalId }).toArray();

    if (results.length > 0) {
      var js = { _id: new mongo2.ObjectID(), userId: userId, comment: comment }
      var myquery = { _id: FinalId };
      var newvalues = { $push: { Comments: js } };
      db.collection("Posts").updateOne(myquery, newvalues, function (err, res) {
      });
      status = 1;
    }
    else {
      status = 2;
    }

  }
  catch (e) {
    console.log(e);
    status = 0;
  }

  var ret = { Status: status };
  res.status(200).json(ret);

});
///////////////////////////////////////
//Get top liked posts
app.post('/api/getTopLikedPosts', async (req, res, next) => {
  // incoming: none
  // outgoing: top 3 liked posts of the entire website

  const db = client.db();
  const results = await db.collection('Posts').find({ Likes: { $exists: true } }).sort({ Likes: -1 }).limit(3).toArray();

  var ret = { Results: results };
  res.status(200).json(ret);

});

///////////////////////////////////////
//get Username
app.post('/api/getUsername', async (req, res, next) => {
  // incoming: userId as string
  // outgoing: username, status | 0 = success, 1 = failure

  var status = 0;
  const { userId } = req.body;
  var FinalId = new mongo2.ObjectID(userId);
  var user = '';

  const db = client.db();
  const results = await db.collection('Users').find({ _id: FinalId }).toArray();

  if (results.length > 0) {
    // User has been found
    user = results[0]['Login'];
  }
  else {
    //user not found
    status = 1;
  }

  var ret = { Status: status, Username: user };
  res.status(200).json(ret);
});

///////////////////////////////////////
//Update like API
app.post('/api/addLike', async (req, res, next) => {
  // incoming: postid, userid
  // outgoing: status of post  | 0 = not liked, 1 = liked, 2 = already liked now unliking
  var status = 0;
  const { postid, userid } = req.body;
  var FinalId = new mongo2.ObjectID(postid);

  const db = client.db();
  const results = await db.collection('Posts').find({ _id: FinalId }).toArray();

  var numOfLikes = 0;

  if (results.length > 0) {
    // The post has been found

    numOfLikes = results[0]['Likes'];

    if (results[0]['LikedUsers'].includes(userid)) {
      // User has already liked this post
      var myquery = { _id: FinalId };
      var newvalues = { $inc: { Likes: -1 } };
      status = 2;
      await db.collection("Posts").updateOne(myquery, newvalues, function (err, res) {
      });

      var myquery = { _id: FinalId };
      var newvalues = { $pull: { LikedUsers: userid } };
      db.collection("Posts").updateOne(myquery, newvalues, function (err, res) {
      });

    }
    else {
      var myquery = { _id: FinalId };
      var newvalues = { $inc: { Likes: 1 }, $push: { LikedUsers: userid } };
      status = 1;
      await db.collection("Posts").updateOne(myquery, newvalues, function (err, res) {
      });
    }
  }
  else {
    // The post has not been found
    status = 0;
  }

  var ret = { Status: status, numOfLikes: numOfLikes };
  res.status(200).json(ret);
});

///////////////////////////////////////
//Get posts
app.post('/api/getPosts', async (req, res, next) => {

  // incoming: userid, array of people following
  // outgoing: list of statuses from people the user is following


  var statuses;
  var username;
  var numlikes;
  var comments;
  var postids2;
  var ret = [];
  var i;
  const { userid, following } = req.body;
  if (following === "undefined") {
    res.status(200).json(ret);
    return next;
  }

  const db = client.db();
  const results = await db.collection('Posts').find().toArray();
  const results2 = await db.collection('Users').find().toArray();

  var keyMap = {};
  for (i = 0; i < results2.length; i++) {
    var tempLogin = results2[i].Login.toString();
    var tempId = results2[i]._id.toString();
    keyMap[tempId] = tempLogin;
  }
  for (i = 0; i < results.length; i++) {

    if (userid == results[i].Userid || (following.split(',').includes(results[i]['Userid']))) {
      statuses = results[i].ContentPost;
      username = results[i].LoginName;
      numlikes = results[i].Likes;
      postids2 = results[i]._id;
      comments = results[i].Comments;
      comments.forEach(element => {
        element["username"] = keyMap[element["userId"]];
      });


      ret.push({ username: username, status: statuses, likes: numlikes, postids: postids2, comments: comments });
    }
  }
  res.status(200).json(ret);
});

app.post('/api/getProfilePosts', async (req, res, next) => {

  // incoming: userid, array of people following
  // outgoing: list of statuses from people the user is following

  var statuses;
  var username;
  var numlikes;
  var comments;
  var postids;
  var ret = [];
  var i;
  const { userid, following } = req.body;
  if (following === "undefined") {
    res.status(200).json(ret);
    return next;
  }

  const db = client.db();
  const results = await db.collection('Posts').find().toArray();
  const results2 = await db.collection('Users').find().toArray();

  

  try {
    var keyMap = {};
    for (i = 0; i < results2.length; i++) {
      var tempLogin = results2[i].Login.toString();
      var tempId = results2[i]._id.toString();
      keyMap[tempId] = tempLogin;
    }

    for (i = 0; i < results.length; i++) {

      if (userid == results[i].Userid) {
        statuses = results[i].ContentPost;
        username = results[i].LoginName;
        numlikes = results[i].Likes;
        postids = results[i]._id;
        comments = results[i].Comments;
        comments.forEach(element => {
          element["username"] = keyMap[element["userId"]];
        });
        ret.push({ username: username, status: statuses, likes: numlikes, postids: postids, comments: comments });
      }
    }
  } catch (error) {
    console.log(error);
  }

  res.status(200).json(ret);
});


// Returns an array of usernames to follow from a username search
app.post('/api/getUsers', async (req, res, next) => {

  // incoming: partial username string
  // outgoing: an array of all usernames that match the string

  var error = '';
  const { username, loggeduser } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({ Login: new RegExp(username) }).toArray();

  var users = "";
  var ret = [];

  if (results.length > 0) {
    for (var i = 0; i < results.length; i++) {
      users = results[i].Login;
      if (users != loggeduser)
        ret.push({ username: users, followers: results[i].Followers, following: results[i].Following });
    }
  }
  else {
    error = 'No Users Found';
  }
  res.status(200).json(ret);

});

// Returns an array of followers that the current user has
app.post('/api/getFollowers', async (req, res, next) => {

  // incoming: logged in users username
  // outgoing: an array of all that username that follow the logged in user 

  var error = '';
  var errornofollowers = '';
  const { loggeduserid } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({ _id: new mongo2.ObjectId(loggeduserid) }).toArray();
  var ret;
  var newret = [];

  try {
    if (results.length > 0) {
      ret = { followers: results[0].Followers };
      for (var i = 0; i < ret.followers.length; i++) {
        var objectidcon = new mongo2.ObjectId(ret.followers[i]);
        const newresults = await db.collection('Users').find({ _id: objectidcon }).toArray();
        var username = newresults[0].Login;
        var userid = newresults[0]._id;
        var userarray = newresults[0].Followers;
        var isFollowing = 0;


        if (newresults.length > 0) {
          newret.push({ follower: username, followerid: userid });
        }
        else
          errornofollowers = "You Have No Followers Loser"
      }
      newret.push({ followernum: ret.followers.length });
    }
    else {
      error = 'No Users Found';
    }

    res.status(200).json(newret);
  } catch (error) {
    console.log(error);
  }


});

app.post('/api/getUserId', async (req, res, next) => {

  // incoming: username
  // outgoing: userId

  const { username } = req.body;
  var userId = 0;

  const db = client.db();
  const results = await db.collection('Users').find({ Login: username }).toArray();

  if (results.length > 0) 
  {
    userId = results[0]._id;
  }else
  {
    // pass
  }
  var ret = { userId: userId};
  res.status(200).json(ret);
});

// Returns an array of users the current user is following
app.post('/api/getFollowing', async (req, res, next) => {

  // incoming: logged in users username
  // outgoing: an array of all usernames that the logged user is following

  var error = '';
  var errornofollowing = '';
  const { loggeduserid } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({ _id: new mongo2.ObjectId(loggeduserid) }).toArray();
  var ret;
  var newret = [];

  try {
    if (results.length > 0) {
      ret = { following: results[0].Following };
      for (var i = 0; i < ret.following.length; i++) {
        var objectidcon = new mongo2.ObjectId(ret.following[i]);
        const newresults = await db.collection('Users').find({ _id: objectidcon }).toArray();
        var username = newresults[0].Login;
        var userid = newresults[0]._id;
        var doesFollowback = 0;

        if (newresults.length > 0) {
          newret.push({ usersfollowing: username, userfollowingid: userid });
        }
        else
          errornofollowing = "You Are Not Following Anyone"
      }
      newret.push({ followingnum: ret.following.length });
    }
    else {
      error = 'No Users Found';
    }
  } catch (error) {
    console.log(error);
  }




  res.status(200).json(newret);

});


///////////////////////////////////////
//Unfollow
app.post('/api/unFollow', async (req, res, next) => {
  // incoming: femaleId (Person being unfollowed), maleId (The person that is doing the unfollowing) 
  // outgoing: status of follow request | 0 = failed, 1 = followed

  var status = 0;
  const { femaleId, maleId } = req.body;
  var femaleIdFinal = new mongo2.ObjectID(femaleId);
  var maleIdFinal = new mongo2.ObjectID(maleId);

  const db = client.db();
  const results = await db.collection('Users').find({ _id: femaleIdFinal }).toArray();

  if (results.length > 0) {
    var myquery = { _id: femaleIdFinal };
    var newvalues = { $pull: { Followers: maleId } };
    status = 1
    // Updates the females follower list
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
    });

    // Updates the males following list
    var myquery = { _id: maleIdFinal };
    var newvalues = { $pull: { Following: femaleId } };
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
    });
  }
  else {
    // Female not found
    status = 0;
  }

  var ret = { Status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////
//Add follow
app.post('/api/addFollow', async (req, res, next) => {
  // incoming: femaleUsername (Person being followed), maleId (The person that is doing the following) 
  // outgoing: status of follow request | 0 = failed, 1 = followed

  var status = 0;
  const { femaleUsername, maleId } = req.body;
  var maleIdFinal = new mongo2.ObjectID(maleId);

  const db = client.db();
  const results = await db.collection('Users').find({ Login: femaleUsername }).toArray();

  if (results.length > 0) {
    var myquery = { Login: femaleUsername };
    var newvalues = { $push: { Followers: maleId } };
    status = 1
    // Updates the person who is being followed followers list
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
    });

    // Updates the person doing the followings following list
    var myquery = { _id: maleIdFinal };
    var newvalues = { $push: { Following: results[0]['_id'].toString() } };
    db.collection("Users").updateOne(myquery, newvalues, function (err, res) {
    });
  }
  else {
    // Female not found
    status = 0;
  }

  var ret = { Status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////
// For following API
app.post('/api/getFollowing', async (req, res, next) => {
  // incoming: userId
  // outgoing: following | -1 user could not be found

  var following = [];

  const { userId } = req.body;
  var userIdFinal = new mongo2.ObjectID(userId);

  const db = client.db();
  const results = await db.collection('Users').find({ _id: userIdFinal }).toArray();

  if (results.length > 0) {
    following = results[0]['Following'];
  }
  else {
    following = -1;
  }
  var ret = { Following: following };
  res.status(200).json(ret);
});

///////////////////////////////////////
// For login API
app.post('/api/login', async (req, res, next) => {
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  var error = '';

  const { login, password } = req.body;

  const db = client.db();
  const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

  var id = -1;
  var fn = '';
  var ln = '';
  var username = '';
  var isValid = 0;
  var following = [];
  var followers = [];
  var profilePicture;
  var favSocks;

  if (results.length > 0) {
    id = results[0]._id;
    fn = results[0].FirstName;
    ln = results[0].LastName;
    isValid = results[0].IsValid;
    username = results[0].Login;
    following = results[0].Following;
    followers = results[0].Followers;
    followers = results[0].Followers;
    profilePicture = results[0].ProfilePicture;
    favSocks = results[0].FavSockPicture;


  }
  else {
    error = 'Invalid user name/password';
  }
  var ret = { id: id, firstName: fn, lastName: ln, error: error, isValid: isValid, username: username, Following: following, Followers: followers, ProfilePicture: profilePicture, favSocks: favSocks };
  res.status(200).json(ret);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

///////////////////////////////////////////////////
// For Heroku deployment
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

///////////////////////////////////////////////////
// For Heroku deployment
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
});

//app.listen(5000); // start Node + Express server on port 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});
