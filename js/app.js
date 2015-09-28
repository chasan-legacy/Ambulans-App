var imei = "1234567890";
var interval = "";
var intervalgps = 60000;
var url = "http://multisolusiglobal.com";
var status = "offline";

$(document).ready(function(){
	//intervalStart();
	$.magnificPopup.open({
	  items: {
		src: '<div class="white-popup">Ada kecelakaan 1.5km dari posisi anda. terima request? <br/><br/>'+ 
					'<a href="#" onclick="$.magnificPopup.close();">OK</a> &nbsp;&nbsp;&nbsp;'+		
				'</div>', // can be a HTML string, jQuery object, or CSS selector
		type: 'inline'
	  }
	});
});

function intervalStart()
{
	sendLocation(imei);
	interval = setInterval(function(){ sendLocation(imei); }, intervalgps);
}

function sendLocation(imei)
{
	
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
       // x.innerHTML = "Geolocation is not supported by this browser.";
    }
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
}