var imei = "1234567890";
var interval = "";
var intervalgps = 30000;
var url = "http://multisolusiglobal.com";
var status = "offline";

$(document).ready(function(){
	//intervalStart();
});

function intervalStart()
{
	sendLocation(imei);
	interval = setInterval(function(){ sendLocation(imei); }, intervalgps);
	getMessage();
}

function sendLocation(imei)
{
	console.log("sini 1");
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
			
			$.ajax({
				type: "POST",
				url: url+"/ambulans/saveLocation.php",
				data: {imei:imei,lng:position.coords.longitude,lat:position.coords.latitude,status: status},
				success: function(data){
					console.log(data);
				}
			});
			
		});
    } else {
			console.log("sini 2");
       // x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getMessage()
{
	//alert(imei);
	$.ajax({
		type: "GET",
		url: url+"/ambulans/getMessage.php",
		data: {imei:imei},
		error: function(){
			setTimeout(function(){ getMessage(); }, 5000);
		},
		success: function(d){
			//console.log(data);
			if(d != ""){
				$.magnificPopup.open({
				  items: {
					src: '<div class="white-popup">'+d+' <br/><br/>'+ 
								'<a href="#" onclick="readmsg()">OK</a> &nbsp;&nbsp;&nbsp;'+		
							'</div>', // can be a HTML string, jQuery object, or CSS selector
					type: 'inline'
				  }
				});
			}else{
				setTimeout(function(){ getMessage(); }, 5000);
			}
		}
	});
}

function readmsg(){
	$.magnificPopup.close();
	$("#contentid").show();
	status = "jalan ke lokasi";
	sendLocation(imei);
	$("#statuscontent").html('<h3>STATUS: '+status+'</h3>');
	$.ajax({
		type: "GET",
		url: url+"/ambulans/getMessage.php",
		data: {imei:imei, status: 'read'},
		error: function(){
			setTimeout(function(){ readmsg(); }, 5000);
		},
		success: function(data){
			setTimeout(function(){ getMessage(); }, 5000);
		}
	});
}

function setStatus()
{	
	status = $("#status").val();
	//alert(status);
	if(status == "offline")
	{
		clearInterval(interval);
	}else
	{
		intervalStart();
	}
	
	$("#statuscontent").html('<h3>STATUS: '+status+'</h3>');
}

function checkpoint(){
	
	if(status == "jalan ke lokasi"){
		status  = "sampai di lokasi";
		$("#katakata").html("jalan ke RS");
	}else if(status == "sampai di lokasi"){
		status  = "jalan ke RS";
		$("#katakata").html("sampai di RS");
	}else if(status == "jalan ke RS"){
		status  = "online";
		$("#contentid").hide();
	}
	
	sendLocation(imei);
	
	$("#statuscontent").html('<h3>STATUS: '+status+'</h3>');
}