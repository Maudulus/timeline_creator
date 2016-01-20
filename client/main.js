var monthDifference;
var yearDifference;
var yearsAndMonths;
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
$(document).ready(function(){

	$('#start-date').val('2014-08-23').focus();
	// $('#calendar').datepicker({
	// 	inline: true,
	// 	changeMonth: false,
	// 	firstDay: 1,
	// 	showOtherMonths: false,
	// 	dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] 
	// });	
	$( "#date-picker" ).datepicker({
		changeYear: true
	});

	$('#start-date').on('blur',function(){
        if($(this).val()){
			$('.timelineVertical ul').empty();	        	
	        var date = new Date($(this).val());
	        var today = new Date();
	        yearDifference = calculateYears(date);
	        monthDifference = monthDiff(date,today);			
	        yearsAndMonths = monthDifference - (yearDifference * 12);
	        var startYear = date.getFullYear();
	        for(var i=0;i<yearDifference;i++){
		        $('.bubbleUlVert').append('<li></li>');
		        $('.verticalLineUlMobile').append('<li class="verticalLineMobile"></li>');
		        $('.dateDivVert').append('<li class="specificDateVert" style="color: rgb(245, 130, 158);">'+startYear+'</li>');
		        startYear++;
	        }
	        var currentMonth=today.getMonth();
	        var dateIndex;
	        var d = new Date();
			var n = d.getMonth()+1;
	        for(var m=0;m<n;m++){
		        $('.bubbleUlVert').append('<li></li>');
		        $('.verticalLineUlMobile').append('<li class="verticalLineMobile"></li>');		        
		        $('.dateDivVert').append('<li class="specificDateVert" style="color: rgb(245, 130, 158);">'+months[currentMonth]+'</li>');
	        	if(currentMonth == 11){
	        		currentMonth = 0;
	        	}else{
	        		currentMonth++;
	        	}
	        }	        
        }
        colorTimeline();
        highlightTimelinePoint();
        // unHightlightTimelinePoints();
	});	
	$('.login-link-and-dropdown-list a.login-link-text').on('click',function(){
	  $('#login-dropdown-list').slideToggle();
	});
});
var calculateYears = function(startDate) {
    var now = new Date();
    var past = new Date(startDate);
    var nowYear = now.getFullYear();
    var pastYear = past.getFullYear();
    var years = nowYear - pastYear;
    return years;
};
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
function colorTimeline(){
	$('.specificDateVert,.verticalLineMobile,.bubbleUlVert li').on('mouseover',function(){
	  var currentIndex = $(this).index();
	  $('.timelineVertical ul li:nth-child('+(currentIndex+1)+')').addClass('active');
	})
	$('.specificDateVert,.verticalLineMobile,.bubbleUlVert li').on('mouseout',function(){
	  var currentIndex = $(this).index();
	  $('.timelineVertical ul li:nth-child('+(currentIndex+1)+')').removeClass('active');
	})		
}
function highlightTimelinePoint(){
	$('.specificDateVert,.verticalLineMobile,.bubbleUlVert li').on('click',function(){
		var currentIndex = $(this).index();
		$('.timelineVertical ul li:nth-child('+(currentIndex+1)+')').addClass('show');
		$('.timelineVertical ul li:not(:nth-child('+(currentIndex+1)+'))').addClass('no-show');
		$('#calendar').datepicker( "show" );		
		console.log(currentIndex)
		console.log(currentIndex%2 == 0)
		if(currentIndex%2){
			$('.timelineVertical').css('margin-left','-40%');
			$('.ui-datepicker-calendar').attr('align','center')				
		}else{
			$('.timelineVertical').css('margin-left','40%');
			$('.ui-datepicker-calendar').attr('align','center')					
		}
	});	
	unHightlightTimelinePoints();
}
function unHightlightTimelinePoints(){
	$('body').on('click',function(event){
		if(!$(event.target).hasClass('show')){
			$('.timeline-event').fadeOut();
			$('.arrow_box').fadeOut();
			revertToCenter();
		}
	});
}
function revertToCenter(){
	$('.timelineVertical').css('margin-left','0');
	$('.timelineVertical ul li').removeClass('no-show');
	$('.timelineVertical ul li').removeClass('show');
	$('.tempStyling').remove();
}
// function addTimelineBubbles(){
// 	$('.bubbleUlVert li').on('click',function(){
// 		console.log('inserting')
// 		$(this).after('<li class="timeline-event" style="height:10px;width:10px;margin-left:-3px;background:purple;position:absolute;"></li>')
// 	});
// }