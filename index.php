<!DOCTYPE html>
<html>

<head>
	<title>Speedulator</title>
	<meta name="viewport" content="initial-scale=1.0">
	<meta charset="utf-8">
	<meta name="description" content="Speedulator - How much time are you really saving when you speed? &copy; Billy Cougan 2017"/>
	<link rel="stylesheet" type="text/css" href="../css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link rel="apple-touch-icon" href="../img/speedulator.png"/>
</head>

<body>
<div class="container">
	
	<div class="page-header" style="margin-top: 10px">
		<!--<h1 style="margin-bottom:0; display: inline-block">Speedulator</h1>-->
		<!-- Trigger the modal with a button -->
		<div><img src="img/speedulator_blazed.png" style="margin-left: -15px; max-width: 75%;">
		<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#myModal" style="float:">Add App</button></div>
		<h4 style="margin-top:0"><b>How much time are you really saving when you speed?</b></h4>
	</div>

	<!-- Modal -->
	<div id="myModal" class="modal fade" role="dialog">
		<div class="modal-dialog">
	
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Add Speedulator App - Mobile</h4>
				</div>
			<div class="modal-body">
				<p>iOS: Open Speedulator in Safari. Tap the share button. Select "Add to Home Screen".</p>
				<p>Android: Open Speedulator in Chrome. Tap the menu button. Select "Add to homescreen".</p>
			</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
	
		</div>
	</div>
	
	<!--<div id="floating-panel">
		<strong>Start:</strong>
		<select id="start">
			<option value="13413">NH</option>
			<option value="chicago, il">Chicago</option>
		</select>
		
		<br>
		
		<strong>End:</strong>
		<select id="end">
			<option value="chicago, il">Chicago</option>
			<option value="st louis, mo">St Louis</option>
			<option value="06110">WH</option>
		</select>
	</div>-->

	<div class="row">
		<br>
		<div class="col-lg-5"><input id="start_input" type="text" class="form-control" placeholder="Where are you starting?" aria-describedby="basic-addon1"></div>
		<div class="col-lg-5"><input id="end_input" type="text" class="form-control" placeholder="Where are you going?" aria-describedby="basic-addon1"></div>
		<div class="col-lg-2"><button id="go" type="button" class="btn btn-success" style="width: 100%" onclick="sendAnalytics(this)">Speedulate!</button></div>
	</div>
	
	<br>
	
	<div class="row" id="results" style="display: none; padding: 10px">
		<div class="col-md-12" style="margin-bottom: 30px; border: solid 1px lightgray; border-radius: 1em">
		<div class="col-lg-5">
			<h2>Speedulator Results</h2>
			<h2 class="well"><small>The <b>All Roads</b> view lists out how much time you will save by speeding on all roads. The <b>Highways</b> view lists out how much time you will save by speeding on just highways.</small></h2>
		</div>
		<div class="col-lg-7">
			<div class="bs-example bs-example-tabs" role="tabpanel"><!-- /Tab -->
				<br>
				<ul class="nav nav-tabs" role="tablist">
					<li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">All Roads</a></li>
					<li role="presentation"><a href="#profile" role="tab" data-toggle="tab" aria-controls="profile">Highways</a></li>
				</ul>
			
				<div class="tab-content">
					<div role="tabpanel" class="tab-pane fade in active" aria-labelledBy="profile-tab">
						<div class="table-responsive">          
							<table class="table">
								<thead>
									<tr>
										<th>MPH Over</th>
										<th>Time Saved</th>
										<th>Trip Duration</th>
									</tr>
								</thead>
								<tbody id="allroads">
								</tbody>
							</table>
						</div>
					</div>
					<div role="tabpanel" class="tab-pane fade" aria-labelledBy="home-tab">
						<div class="table-responsive">          
							<table class="table">
								<thead>
									<tr>
										<th>MPH Over</th>
										<th>Time Saved</th>
										<th>Trip Duration</th>
									</tr>
								</thead>
								<tbody id="highways">
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div><!-- /Tab -->
		</div>
		</div>
		<br>
	</div>
	
	<div class="row">
		
		<div class="bs-example bs-example-tabs" role="tabpanel"><!-- /Tab -->
		
			<ul class="nav nav-tabs" role="tablist">
				<li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">Map</a></li>
				<li role="presentation"><a href="#profile" role="tab" data-toggle="tab" aria-controls="profile">Directions</a></li>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane fade in active" aria-labelledBy="home-tab">
					<div class="row">
						<div id="map"></div>
						<br>
					</div>
				</div>
			
				<div role="tabpanel" class="tab-pane fade" aria-labelledBy="profile-tab">
					<div class="">
						<div id="right-panel" class="col-md-6"></div>
					</div>
				</div>
			</div>
		</div><!-- /Tab -->
	</div>
	
    <footer>
    	<hr>
        <p>&copy; Billy Cougan 2017</p>
        <br>
    </footer>
    
</div>
	<script src="../js/jquery.js"></script>
	<script src="../js/bootstrap/bootstrap.js"></script>
	<script src="js/speedulator.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyALPfazUNzdLMknQskwdbM5bJVx4T03FWU&libraries=places&callback=initMap" async defer></script>
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'UA-41286737-3', 'auto');
		ga('send', 'pageview');
	</script>
	<script>
		function sendAnalytics(event) {
			let category = event.nodeName;
			let action = window.event.type;
			let label = event.innerHTML;
			let start = document.getElementById('start_input').value;
			let end = document.getElementById('end_input').value;
			let tripData = {'start' : start, 'end' : end};
			ga('send', 'event', 'Button Click', 'Speedulate', tripData);
			//alert(category + " " + action + " " + label + " " + tripData.start);
		}
	</script>
</body>
</html>

