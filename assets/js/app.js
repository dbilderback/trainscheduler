//Initialize Varialbes
var url ='https://trainscheduler-87aed.firebaseio.com/';
var dataRef = new Firebase(url);
function init() {
     addTrainEvent();     
     updateTable();
     setInterval(function() {
       updateTable();
     }, 30000);
     timer(30000, updateTable);
     timer(1000, updateCurrentTime);
}

function addTrainEvent() {
     //Initalize Variables
     var name ='';
     var destination = '';
     var firstStopTime = '';
     var frequency = '';
     
     //Event Handler and function to add new trains
     $('#addTrain').on('click', function() {
          //Assigning form values
          name = $('#nameInput').val().trim();
          destination = $('#destinationInput').val().trim();
          firstStopTime = $('#firstStopTimeInput').val().trim();
          frequency = $('#frequencyInput').val().trim();
          pushTrainData(name, destination, firstStopTime, frequency);
          resetForm();
     });
}

function timer(time, methodToCall) {
     setInterval(function() {
          methodToCall();
     }, time);
}

function updateCurrentTime() {
     var currentTime = moment().format("hh:mm:ss");
     $('#time').text('Current Time: ' + currentTime);
}

function pushTrainData(name, destination, firstStopTime, frequency) {
     var trainRoute = '';
     // Push the data
     trainRoute = dataRef.push({
          name: name,
          destination: destination,
          firstStopTime: firstStopTime,  // 2:22 in my example
          frequency: frequency,
     });
}

function resetForm() {
     //Empty form values for next input
     $('#nameInput').val('');
     $('#destinationInput').val('');
     $('#firstStopTimeInput').val('');
     $('#frequencyInput').val('');
}

function updateTable() {
     //Empty HTML Table
     $('.trainSchedule').empty();
     //Handle new adds to the database
     dataRef.on("child_added", function(childSnapshot) {
          var nextTrain = '';
          var nextTrainFormatted = '';
          var minutesAway = '';
          var firstTimeConverted = '';
          var currentTime = '';
          var minutesTillTrain = '';
          var timeRemainder = '';
          var timeDifference = '';
          
          //Using Moment.js to manipulate and format time
          firstTimeConverted = moment(childSnapshot.val().firstStopTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
          timeRemainder = timeDifference % childSnapshot.val().frequency;
          minutesTillTrain = childSnapshot.val().frequency - timeRemainder;
          nextTrain = moment().add(minutesTillTrain, "minutes");
          nextTrainFormatted = moment(nextTrain).format("hh:mm");
          $('.trainSchedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + nextTrainFormatted + // Next Arrival Formula ()
               "</td>" +
               "<td class='col-xs-2'>" + minutesTillTrain + // Minutes Away Formula
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='removeTrain btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");
     });
     removeTrainHandler();
}

function removeTrainHandler() {
     //Initialize Variables
     var getKey = '';
     //Event handler to remove the train row
     $("body").on("click", ".removeTrain", function(){
          $(this).closest ('tr').remove();
          getKey = $(this).parent().parent().attr('id');
          dataRef.child(getKey).remove();
     });
}