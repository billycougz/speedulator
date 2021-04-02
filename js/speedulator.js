/**
 * Speedulator
 * Version 2.0
 * 
 * Billy Cougan
 * January 2017
 */

//Google Maps function that displays the map on page load
//Modified to comment out the functions relating to the floating panel (location options list)
function initMap() {

	var directionsDisplay = new google.maps.DirectionsRenderer;
	var directionsService = new google.maps.DirectionsService;
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: {lat: 41.85, lng: -87.65}
	});
	
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('right-panel'));
	
	//var control = document.getElementById('floating-panel');
	//control.style.display = 'block';
	//map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

	var onChangeHandler = function() {
		calculateAndDisplayRoute(directionsService, directionsDisplay);
	};
	
	document.getElementById('go').addEventListener('click', onChangeHandler);
			
	//commented out, used for floating panel
	//document.getElementById('start').addEventListener('change', onChangeHandler);
	//document.getElementById('end').addEventListener('change', onChangeHandler);
	
	//Added code for autocomplete functionality
	var start_input = document.getElementById('start_input');
	var start_autocomplete = new google.maps.places.Autocomplete(start_input);
	var end_input = document.getElementById('end_input');
	var end_autocomplete = new google.maps.places.Autocomplete(end_input);
}


//Google Maps function that calculates and displays a route
//Modified to also run Speedulator app functions
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	
	var stepObjectArray = [];
	var start = document.getElementById('start_input').value;
	var end = document.getElementById('end_input').value;

	if(start == "" || end == ""){
		alert('Enter a start and end location before Speedulating.');
		return;
	}
	
	directionsService.route({
		origin: start,
		destination: end,
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {
			
			directionsDisplay.setDirections(response);			stepObjectArray = response.routes[0].legs[0].steps;
			convertDistance(stepObjectArray);
			convertDuration(stepObjectArray);
			calculateSpeedLimit(stepObjectArray);
			calculateActualTime(stepObjectArray);
			calculateSpeedTime(stepObjectArray);
			calculateTimeSaved(stepObjectArray);
			displayResults(stepObjectArray);
						
		} else {window.alert('Directions request failed due to ' + status);}
	});
}


//Convert distance from meters to miles
function convertDistance(stepObjectArray) {

	$.each(stepObjectArray, function( index, stepObject ) {
		
		stepObject.distance.value = stepObject.distance.value * 0.0006213712;
	});

	return stepObjectArray;
}


//Convert duration from seconds to hours
function convertDuration(stepObjectArray) {

	$.each(stepObjectArray, function( index, stepObject ) {
		
		stepObject.duration.value = stepObject.duration.value / 3600;
	});

	return stepObjectArray;
}


//Calculate speed limit based on Google estimates and actual speed limit thresholds
function calculateSpeedLimit(stepObjectArray) {
	
	var speedLimit;
	
	$.each(stepObjectArray, function( index, stepObject ) {
		
		speedLimit = Math.round(stepObject.distance.value / stepObject.duration.value);
		
		if(speedLimit > 69){
			speedLimit = 70;
		}else
		if(speedLimit > 59 && speedLimit < 70){
			speedLimit = 65;
		}else
		if(speedLimit > 49 && speedLimit < 60){
			speedLimit = 55;
		}else
		if(speedLimit > 39 && speedLimit < 50){
			speedLimit = 45;
		}else
		if(speedLimit > 29 && speedLimit < 40){
			speedLimit = 35;
		}else
		if(speedLimit < 30){
			speedLimit = 30;
		}
		
		stepObject.speedLimit = speedLimit;
	});
	
	return stepObjectArray;
}


//Calculate actual duration of each step given the calculated speed limit
function calculateActualTime(stepObjectArray) {

	$.each(stepObjectArray, function( index, stepObject ) {
		
		stepObject.actualTime = stepObject.distance.value / stepObject.speedLimit;
	});

	return stepObjectArray;
}


//Calculate the duration for each step at different speeds
function calculateSpeedTime(stepObjectArray) {

	$.each(stepObjectArray, function( index, stepObject ) {
		
		stepObject.speedTime = {};
		stepObject.speedTime.five = stepObject.distance.value / (stepObject.speedLimit + 5);
		stepObject.speedTime.ten = stepObject.distance.value / (stepObject.speedLimit + 10);
		stepObject.speedTime.fifteen = stepObject.distance.value / (stepObject.speedLimit + 15);
		stepObject.speedTime.twenty = stepObject.distance.value / (stepObject.speedLimit + 20);
		stepObject.speedTime.twentyfive = stepObject.distance.value / (stepObject.speedLimit + 25);
	});

	return stepObjectArray;
}


//Calculate time saved for each step at different speeds
function calculateTimeSaved(stepObjectArray) {

	$.each(stepObjectArray, function( index, stepObject ) {
		stepObject.timeSaved = {};
		stepObject.timeSaved.five = stepObject.actualTime - stepObject.speedTime.five;
		stepObject.timeSaved.ten = stepObject.actualTime - stepObject.speedTime.ten;
		stepObject.timeSaved.fifteen = stepObject.actualTime - stepObject.speedTime.fifteen;
		stepObject.timeSaved.twenty = stepObject.actualTime - stepObject.speedTime.twenty;
		stepObject.timeSaved.twentyfive = stepObject.actualTime - stepObject.speedTime.twentyfive;
	});
	
	return stepObjectArray;
}


//Sum the total time saved and total durations for each speed for both highways and all roads, format into html table, display the table
function displayResults(stepObjectArray) {

	var allRoadsResults = [];
	var highwayResults = [];
	
	var totalTimeSaved = {};
	totalTimeSaved.five = 0;
	totalTimeSaved.ten = 0;
	totalTimeSaved.fifteen = 0;
	totalTimeSaved.twenty = 0;
	totalTimeSaved.twentyfive = 0;
	
	var totalDuration = {};
	totalDuration.zero = 0;
	totalDuration.five = 0;
	totalDuration.ten = 0;
	totalDuration.fifteen = 0;
	totalDuration.twenty = 0;
	totalDuration.twentyfive = 0;
	
	var highwayTotalTimeSaved = {};
	highwayTotalTimeSaved.five = 0;
	highwayTotalTimeSaved.ten = 0;
	highwayTotalTimeSaved.fifteen = 0;
	highwayTotalTimeSaved.twenty = 0;
	highwayTotalTimeSaved.twentyfive = 0;
	
	var highwayTotalDuration = {};
	highwayTotalDuration.zero = 0;
	highwayTotalDuration.five = 0;
	highwayTotalDuration.ten = 0;
	highwayTotalDuration.fifteen = 0;
	highwayTotalDuration.twenty = 0;
	highwayTotalDuration.twentyfive = 0;

	$.each(stepObjectArray, function( index, stepObject ) {

		totalTimeSaved.zero = 0;
		totalTimeSaved.five = totalTimeSaved.five + stepObject.timeSaved.five;
		totalTimeSaved.ten = totalTimeSaved.ten + stepObject.timeSaved.ten;
		totalTimeSaved.fifteen = totalTimeSaved.fifteen + stepObject.timeSaved.fifteen;
		totalTimeSaved.twenty = totalTimeSaved.twenty + stepObject.timeSaved.twenty;
		totalTimeSaved.twentyfive = totalTimeSaved.twentyfive + stepObject.timeSaved.twentyfive;
		
		totalDuration.zero = totalDuration.zero + stepObject.actualTime;
		totalDuration.five = totalDuration.five + stepObject.speedTime.five;
		totalDuration.ten = totalDuration.ten + stepObject.speedTime.ten;
		totalDuration.fifteen = totalDuration.fifteen + stepObject.speedTime.fifteen;
		totalDuration.twenty = totalDuration.twenty + stepObject.speedTime.twenty;
		totalDuration.twentyfive = totalDuration.twentyfive + stepObject.speedTime.twentyfive;
		
		if(stepObject.speedLimit > 45){
			highwayTotalTimeSaved.zero = 0;
			highwayTotalTimeSaved.five = highwayTotalTimeSaved.five + stepObject.timeSaved.five;
			highwayTotalTimeSaved.ten = highwayTotalTimeSaved.ten + stepObject.timeSaved.ten;
			highwayTotalTimeSaved.fifteen = highwayTotalTimeSaved.fifteen + stepObject.timeSaved.fifteen;
			highwayTotalTimeSaved.twenty = highwayTotalTimeSaved.twenty + stepObject.timeSaved.twenty;
			highwayTotalTimeSaved.twentyfive = highwayTotalTimeSaved.twentyfive + stepObject.timeSaved.twentyfive;
		}
	});

	highwayTotalDuration.zero = totalDuration.zero;
	highwayTotalDuration.five = highwayTotalDuration.zero - highwayTotalTimeSaved.five;
	highwayTotalDuration.ten = highwayTotalDuration.zero - highwayTotalTimeSaved.ten;
	highwayTotalDuration.fifteen = highwayTotalDuration.zero - highwayTotalTimeSaved.fifteen;
	highwayTotalDuration.twenty = highwayTotalDuration.zero - highwayTotalTimeSaved.twenty;
	highwayTotalDuration.twentyfive = highwayTotalDuration.zero - highwayTotalTimeSaved.twentyfive;

	allRoadsResults = '';
	allRoadsResults = allRoadsResults + '<tr><td>0mph</td><td>0h 0m</td><td>' + convertHours(totalDuration.zero) + '</td></tr>';
	allRoadsResults = allRoadsResults + '<tr><td>5mph</td><td>' + convertHours(totalTimeSaved.five) + '</td><td>' + convertHours(totalDuration.five) + '</td></tr>';
	allRoadsResults = allRoadsResults + '<tr><td>10mph</td><td>' + convertHours(totalTimeSaved.ten) + '</td><td>' + convertHours(totalDuration.ten) + '</td></tr>';
	allRoadsResults = allRoadsResults + '<tr><td>15mph</td><td>' + convertHours(totalTimeSaved.fifteen) + '</td><td>' + convertHours(totalDuration.fifteen) + '</td></tr>';
	allRoadsResults = allRoadsResults + '<tr><td>20mph</td><td>' + convertHours(totalTimeSaved.twenty) + '</td><td>' + convertHours(totalDuration.twenty) + '</td></tr>';
	allRoadsResults = allRoadsResults + '<tr><td>25mph</td><td>' + convertHours(totalTimeSaved.twentyfive) + '</td><td>' + convertHours(totalDuration.twentyfive) + '</td></tr>';
	
	highwayResults = '';
	highwayResults = highwayResults + '<tr><td>0mph</td><td>0h 0m</td><td>' + convertHours(totalDuration.zero) + '</td></tr>';
	highwayResults = highwayResults + '<tr><td>5mph</td><td>' + convertHours(highwayTotalTimeSaved.five) + '</td><td>' + convertHours(highwayTotalDuration.five) + '</td></tr>';
	highwayResults = highwayResults + '<tr><td>10mph</td><td>' + convertHours(highwayTotalTimeSaved.ten) + '</td><td>' + convertHours(highwayTotalDuration.ten) + '</td></tr>';
	highwayResults = highwayResults + '<tr><td>15mph</td><td>' + convertHours(highwayTotalTimeSaved.fifteen) + '</td><td>' + convertHours(highwayTotalDuration.fifteen) + '</td></tr>';
	highwayResults = highwayResults + '<tr><td>20mph</td><td>' + convertHours(highwayTotalTimeSaved.twenty) + '</td><td>' + convertHours(highwayTotalDuration.twenty) + '</td></tr>';
	highwayResults = highwayResults + '<tr><td>25mph</td><td>' + convertHours(highwayTotalTimeSaved.twentyfive) + '</td><td>' + convertHours(highwayTotalDuration.twentyfive) + '</td></tr>';
	
	$( "#allroads" ).html( allRoadsResults );
	$( "#highways" ).html( highwayResults );
	
	//The #results div is hidden on page load, so by changing display to block, it becomes visible
	document.getElementById ( "results" ).style.display = "block" ;
	
	return stepObjectArray;
}


//Add IDs to the bootstrap tab navs (allows for multiple tab navs to function independently on one page)
$(document).ready(function(){
	$('.nav-tabs a').click(function(e){
		e.preventDefault();
		var tabIndex = $('.nav-tabs a').index(this);
		$(this).parent().siblings().removeClass("active");
		$(this).parent().addClass("active");
		$('.tab-pane:eq( '+tabIndex+' )').siblings().removeClass("in active");
		$('.tab-pane:eq( '+tabIndex+' )').addClass("in active");
	});
});

//Convert hours to hours and minutes
function convertHours(hours){
	var hoursBefore = hours;
	var hoursAfter = hoursBefore.toString().split(".")[0]; ///before
	var minutesAfter = hoursBefore.toString().split(".")[1]; ///after
	
	if(minutesAfter) {
		minutesAfter = Math.round(Number("." + minutesAfter) * 60);
	} else {
		minutesAfter = "0";
	}
	
	if(minutesAfter == 60) {
		minutesAfter = 0;
		hoursAfter = Number(hoursAfter) + 1;
	}
	
	var hoursMinutes = hoursAfter + 'h ' + minutesAfter + 'm';
	
	return hoursMinutes;
}

//------------------------------------------------stepObjectArray heirarchy
//console.log(response);
//console.log(response.routes);
//console.log(response.routes[0]);
//console.log(response.routes[0].legs);
//console.log(response.routes[0].legs[0]);
//console.log(response.routes[0].legs[0].steps);
//console.log(response.routes[0].legs[0].steps[0]);
//console.log(response.routes[0].legs[0].steps[0].distance);
//console.log(response.routes[0].legs[0].steps[0].distance.value);
//console.log(response.routes[0].legs[0].steps[0].distance.value * 0.0006213712 + " mi");