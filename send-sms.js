// const Nexmo = require('nexmo');

// const nexmo = new Nexmo({
//   apiKey: '417a64a4',
//   apiSecret: 'axLHNfMf61i9WD8P',
// });

// const from = 'Nexmo';
// const to = '639668162352';
// const text = 'TESTING JOSEON';

// nexmo.message.sendSms(from, to, text);
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=2h37WVHfTq-U-z5sUc0g2A==&to=486324684&content=FROM SHITNEZZ", true);
xhr.onreadystatechange = function(){
    if (xhr.readyState == 4 && xhr.status == 200){
        console.log('success')
    }
};
xhr.send();


// curl "https://platform.clickatell.com/messages/http/send?apiKey=2h37WVHfTq-U-z5sUc0g2A==&to=639164356928&content=JOEMAR"