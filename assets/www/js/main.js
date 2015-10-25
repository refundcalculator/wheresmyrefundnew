
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //window.isAndroid = !window.isRipple && navigator.userAgent.match(/(android)/gi) != null;
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false); //Listen to the User clicking on the back button         
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {  
        
    },
    
    onBackKeyDown: function(e) {
        e.preventDefault();
        if (confirm("Are you sure you want to exit ?")) {//If User selected No, then we just do nothing
            navigator.app.exitApp();// Otherwise we quit the app.
        }
        //navigator.notification.confirm("Are you sure you want to exit ?", this.onConfirm, "Confirmation", "Yes,No");
        // Prompt the user with the choice
    },
    
    onConfirm: function(button) {
        if (button == 2) {//If User selected No, then we just do nothing
            return;
        } else {
            navigator.app.exitApp();// Otherwise we quit the app.
        }
    }
};

app.initialize();

function isNetConnect() {

    network = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    if (states[network] == 'No network connection') {
        //navigator.notification.alert("Please provide us the internet access", function() {}, "Error");
        return false;
    } else {        
        return true;
    }
}

function isValidEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function showAlert(message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
}


$(document).on('pagehide', function(event, ui) {

});

$(document).on('pageshow', function(event, data) {

});

$(document).on('pageshow', "#two", function(){
    var params = $(this).data('url').split("?")[1];
    var chunk = params.split("&");
    var start_date = chunk[0].replace("start_date=", "");
    var end_date = chunk[1].replace("end_date=", "");
    var email = chunk[2].replace("email=", "");
    var when = chunk[3].replace("when=", "");
    
    process(start_date, end_date, email, when);
    
});
        
$(document).on('vclick', '#result', function(e) {
    
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    
    var Start_date = $(".starting").val();
    var End_date   = $(".ending").val();
    var Emailz     = $(".Emailz").val();
    var when       = $(".when").val();
    
    if(true){
        
        if(Start_date == "" || End_date == "" || Emailz == ""){
            alert("Fields are mandatory");
            return;
        }
        
        if(! isValidEmail(Emailz)){
            alert("Email not valid format.");
            return;
        }
        
        $.mobile.allowCrossDomainPages = true;
        $.support.cors = true;
            
        $.ajax({         
            url:'http://app.taxschedule.com/external.php',
            type: 'POST',
            data: {
                Start_date: Start_date,
                End_date:   End_date,
                Emailz:     Emailz,
                when:       when
            },
            
            cache: false,
            dataType: "json",
    
            success: function (res) {
                
                if(res.status == "1"){                    
                    $.mobile.changePage( "result.html", { dataUrl : "result.html", data : { 'start_date' : res.data.start_date, 'end_date' : res.data.end_date, 'email' : res.data.email, 'when' : res.data.when}, reloadPage : false, changeHash : true, transition: "slide" });
                }else{
                    showAlert("No Refund Date Found. Please verify that you entered the correct IRS Approval Date.", 'Note');                    
                }
            },
            error: function(jqXHR, status){
    
                alert(jqXHR.status);
                alert(status);
            }
        });        
        return false;
    }
    else{
        alert("No network connection.");
        return false;
    }    
});

function process(sd, ed, e, w){
    
    $.ajax({
        url:'http://app.taxschedule.com/result.php',
        type: 'POST',
        data: {
            Start_date: sd,
            End_date:   ed,
            Emailz:     e,
            when:       w
        },
   
        dataType: "JSON",
        success: function (data) {
        	
        	var str = data;          
            var res = str.split("|");
            
			$(".dd").val(res[0]);
			$(".cm").val(res[1]);
        }
    });
}