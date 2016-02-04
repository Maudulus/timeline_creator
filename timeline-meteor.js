var StartDate = new Mongo.Collection("startDate");
var newEvent = new Mongo.Collection("newevent");
if (Meteor.isClient) {
	Template.modalButtons.events({
		"click .choose-date": function (event) {
			if( Meteor.user() ){
				newEvent.insert({
					type:event.target.id,
					name: $('.event-name').val(),
					description: $('.event-description').val(),
					date: $('#date-picker').val(),
					createdAt: new Date(),
					user: Meteor.user()._id,
					email: Meteor.user().emails[0].address
				});
			}else{
			}
		}
	});
	Template.body.events({
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
				console.log(currentIndex)
				var chosenMonth = $('.leftDate .specificDateVert:nth-child('+(currentIndex+1)+')').text();
				var currentYear = (new Date).getFullYear().toString();
				var userEvents = newEvent.find({email:Meteor.user().emails[0].address}).fetch();
				console.log(userEvents)
				var count = 0;
				$.each(userEvents,function(index,thisEvent){
					var monthWord = months[Number(thisEvent.date.split('/')[0]-1)];
					var year = thisEvent.date.split('/')[2];
					if( (monthWord == chosenMonth && currentYear == year) || year.toString() == chosenMonth){
						$('.bubbleUlVert li:nth-child('+(currentIndex+1)+')').after('<li class="timeline-event offset-'+count+'"></li>');
						$('.timelineVertical').prepend('<div class="arrow_box '+thisEvent.type+' offset-'+count+'"><table><tr><td>'+thisEvent.date+'</td><td>'+thisEvent.name+'</td></tr></table><p>'+thisEvent.description+'</p></div>');
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
					console.log(desiredOffset)
					if ( (currentIndex%2) == 0){
						console.log('a******')
						$('body').append('<style class="tempStyling">.arrow_box:before{visibility:visible !important; }</style>');
						$('.arrow_box.offset-'+it).offset({top: desiredOffset.top-20,left: desiredOffset.left-($('.arrow_box.offset-'+it).width()+40)});				
					}else{
						console.log('b******')
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

