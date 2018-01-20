//Initialize Varialbes
var url ="https://trainscheduler-87aed.firebaseio.com/";
var dataRef = new Firebase(url);
var name ='';
var destination = '';
var firstStopTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var minutesTillTrain = '';
var timeRemainder = '';
var trainRoute = '';
var getKey = '';
var timeDifference = '';

$(document).ready(function() {
     //Event Handler and function to add new trains
     $("#addTrain").on("click", function() {
          //Assigning form values
     	name = $('#nameInput').val().trim();
     	destination = $('#destinationInput').val().trim();
     	firstStopTime = $('#firstStopTimeInput').val().trim();
     	frequency = $('#frequencyInput').val().trim();
          //Using Moment.js to manipulate and format time
          firstTimeConverted = moment(firstStopTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
          timeRemainder = timeDifference % frequency;
          minutesTillTrain = frequency - timeRemainder;
          nextTrain = moment().add(minutesTillTrain, "minutes");
          nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// Push the data
     	trainRoute = dataRef.push({
     		name: name,
     		destination: destination,
     		firstStopTime: firstStopTime,  // 2:22 in my example
     		frequency: frequency,
               nextTrainFormatted: nextTrainFormatted,
               minutesTillTrain: minutesTillTrain
     	}
          //Empty form values for next input
          $('#nameInput').val('');
     	$('#destinationInput').val('');
     	$('#firstStopTimeInput').val('');
     	$('#frequencyInput').val('');

     	return false;
     });
          //Handle new adds to the database
     dataRef.on("child_added", function(childSnapshot) {

		$('.trainSchedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + // Next Arrival Formula ()
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain + // Minutes Away Formula
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='removeTrain btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");

//Event handler to remove the train row
$("body").on("click", ".removeTrain", function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     dataRef.child(getKey).remove();
});

});