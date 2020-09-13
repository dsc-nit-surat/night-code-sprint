const moment=require('moment');

function formatmessage(username,text) {
    return{
        username:username,
        text:text,
        //for real moment time
        time:moment().format('h:mm a')
    }
}
module.exports=formatmessage;