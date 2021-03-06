var StartDate = new Mongo.Collection("startDate");
var newEvent = new Mongo.Collection("newevent");
var placeLatLng;
if (Meteor.isClient) {
	Template.modalButtons.events({
		"click .choose-date": function (event) {
			if( Meteor.user() ){
				var eventLocation = $('#autocomplete').val() ? placeLatLng : "";
				newEvent.insert({
					type:event.target.id,
					name: $('.event-name').val(),
					description: $('.event-description').val(),
					date: $('#date-picker').val(),
					createdAt: new Date(),
					user: Meteor.user()._id,
					email: Meteor.user().emails[0].address,
					location: eventLocation
				});
			}else{
			}
		}
	});
	Template.map.events({
	});
	Template.body.events({
		"click .plot-event": function(event){
			var autocomplete = new google.maps.places.Autocomplete(
				(document.getElementById('autocomplete')),{types: ['geocode'] }
			);

	        google.maps.event.addListener(autocomplete, 'place_changed', function () {
	           var place = autocomplete.getPlace();
	           placeLatLng = [place.geometry.location.lng(), place.geometry.location.lat()];
	        });
		},
		"click #openMap": function(event){
			var features = [];
			var userEvents = newEvent.find({email:Meteor.user().emails[0].address}).fetch();
			for(var i=0; i < userEvents.length;i++){
				if(userEvents[i].location){
					features.push({
						type:"Feature",
						geometry:{
							type:"Point",
							coordinates:userEvents[i].location
						},
						properties:{
							title:userEvents[i].name,
							"marker-symbol":"marker"
						},
					});
				}
			}			
			setTimeout(function(){
				mapboxgl.accessToken = 'pk.eyJ1IjoibWF1ZHVsdXMiLCJhIjoiY2lqbHkxODBxMDA4dHU0bTVwOThiNjBqbCJ9.ALkY_spgnw5ZqOWx4qECZA';
				var map = new mapboxgl.Map({
				    container: 'map',
				    style: 'mapbox://styles/mapbox/streets-v8',
				    center: [-96, 37.8],
				    zoom: 3
				});
				console.log(JSON.stringify(features));
				map.on('style.load', function () {
				    map.addSource("markers", {
				        "type": "geojson",
				        "data": {
				            "type": "FeatureCollection",
				            "features": features
				        }
				    });
				    map.addLayer({
				        "id": "markers",
				        "type": "symbol",
				        "source": "markers",
				        "layout": {
				            "icon-image": "{marker-symbol}-15",
				            "text-field": "{title}",
				            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
				            "text-offset": [0, 0.6],
				            "text-anchor": "top"
				        }
				    });
				});	
			},200); 
		},
		"blur #start-date": function (event) {
			if( Meteor.user() && !StartDate.find({email:Meteor.user().emails[0].address}).fetch().length){
				var date = event.target.value;
				StartDate.insert({
					date: date,
					createdAt: new Date(), // current time
					user: Meteor.user()._id,
					email: Meteor.user().emails[0].address
				});
			}else{

			}
		},
		"click .specificDateVert, click .verticalLineMobile, click .bubbleUlVert li": function (event) {
			if( Meteor.user() ){
				var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

				$('.timeline-event').remove();
				$('.arrow_box').remove();
				var currentIndex = $(event.target).index();
				var chosenMonth = $('.leftDate .specificDateVert:nth-child('+(currentIndex+1)+')').text();
				var currentYear = (new Date).getFullYear().toString();
				var userEvents = newEvent.find({email:Meteor.user().emails[0].address}).fetch();
				var count = 0;
				$.each(userEvents,function(index,thisEvent){
					var monthWord = months[Number(thisEvent.date.split('/')[0]-1)];
					var year = thisEvent.date.split('/')[2];
					if( (monthWord == chosenMonth && currentYear == year) || year.toString() == chosenMonth){
						var rightDateClass = "";
						var rightDateClass = ( (currentIndex%2) == 0) ? "" : "rightDate";
						$('.bubbleUlVert li:nth-child('+(currentIndex+1)+')').after('<li class="timeline-event offset-'+count+'"></li>');
						$('.timelineVertical').prepend('<div class="arrow_box '+thisEvent.type+' offset-'+count+'"><div class="parentRotate '+rightDateClass+'"><div class="inner rotate '+rightDateClass+'">'+thisEvent.date+'</div></div><div class="rightSide"><table class="bubbleTable"><tr><td class="bubbleTableEvent">'+thisEvent.name+'</td></tr></table><p>'+thisEvent.description+'</p></div></div>');
						count++;
					}
				});
				for (var i=0;i<count;i++){
					var heightSet = $('.arrow_box.offset-'+i).height();
					// $('.arrow_box.offset-'+i).css('margin-top',(40+heightSet)+"px"); 
					$('.timeline-event.offset-'+(i-1) ).css('margin-top',40+(heightSet)+"px");				
				}
				for (var it=0;it<count;it++){
					var desiredOffset = $('.timeline-event.offset-'+it).offset();
					if ( (currentIndex%2) == 0){
						$('body').append('<style class="tempStyling">.arrow_box:before{visibility:visible !important; }</style>');
						$('.arrow_box.offset-'+it).offset({top: desiredOffset.top-20,left: desiredOffset.left-($('.arrow_box.offset-'+it).width()+40)});				
					}else{
						$('body').append('<style class="tempStyling">.arrow_box:after{visibility:visible !important; }</style>');
						$('.arrow_box.offset-'+it).offset({top: desiredOffset.top-20,left: desiredOffset.left + 40 });				
					}
				}
			}
		}	
	});	
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    
  });
}
Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('map', {data: {}});
});
Router.route('/map', function () {
  // render the Home template with a custom data context
  this.render('map', {data: {}});
});

