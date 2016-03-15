window.onload = function() {
 
	$.get("/upToDateMessages", function (messages){
			var formattedMessages = "";
			for (i = 0; i < messages.docs.length; i++) { 
				formattedMessages += "" + messages.docs[i]["user"] + ":" + messages.docs[i]["message"] + "<br>";
			}
			document.getElementById("oldMessages").innerHTML = formattedMessages;
		}	
	)
    var messages = [];
    var socket = io.connect('http://learntocode.mybluemix.net/');
    var field = document.getElementById("field");
	var username = document.getElementById("username");
    var sendButton = document.getElementById("send");
    var newMessages = document.getElementById("newMessages");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            newMessages.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        var text = field.value;
		var user = username.value;
		$.post("/sendAndSave", { "username": user,"message": text });
		field.value = "";
    };
 
}