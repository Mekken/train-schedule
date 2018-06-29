$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyC8Zgr4alZJDR32kVnI7fS3H5OXavGtMJI",
        authDomain: "train-schedule-97719.firebaseapp.com",
        databaseURL: "https://train-schedule-97719.firebaseio.com",
        projectId: "train-schedule-97719",
    }
    var database = firebase.initializeApp(config).database();

    $('#submit').on('click',function() {
        var formattedTime = moment($('#train-time').val().trim(),'HH:mm').format('hh:mm A');
        
        var nameVal  = $('#trainName').val().trim(),
        destinationVal  = $('#destination').val().trim(),
        trainTimeVal  = formattedTime,
        frequencyVal = $('#frequency').val().trim(),
        nextArrival = moment(trainTimeVal,'hh:mm A').add(frequencyVal,'m')

        database.ref().push({
            name: nameVal,
            destinationName: destinationVal,
            trainTime: trainTimeVal,
            frequencyTime: frequencyVal,
            arrivalTime:  nextArrival.unix()
        })

        $('#trainName').val('');
        $('#destination').val('');
        $('#train-time').val('');
        $('#frequency').val('');
    })

    database.ref().on('child_added', function(snapShot) {
        var sv = snapShot.val();
        var arrivalTime = moment.unix(sv.arrivalTime);
        var minutesAway = undefined;

        console.log("Next Arrival Time: " + arrivalTime.format('hh:mm A'));
        
        while(arrivalTime.diff(moment(),'m') <= 0) 
        {
            console.log('adding time...');
            arrivalTime.add(sv.frequencyTime,'m');
        }

        minutesAway = arrivalTime.diff(moment(),'m');

        console.log("SnapShot Name: " + sv.name);
        console.log("SnapShot Destination: " + sv.destinationName);
        console.log("SnapShot Train Time: " + sv.trainTime);
        console.log("SnapShot Frequency: " + sv.frequencyTime);
        console.log("Next Arrival Time: " + arrivalTime.format('hh:mm A'));
        console.log("Minutes Away: " + minutesAway);

        var tbodyElem = $('#train-records');
        var trElem = $('<tr>');
        var tdName = $('<td>').addClass('train-name').append(sv.name);
        var tdDestination = $('<td>').addClass('destination').append(sv.destinationName);
        var tdFrequency = $('<td>').addClass('frequency').append(sv.frequencyTime);
        var tdNextArrival = $('<td>').addClass('next-arrival').append(arrivalTime.format('hh:mm A'));
        var tdMinutesAway = $('<td>').addClass('minutes-away').append(minutesAway);

        trElem.append(tdName);
        trElem.append(tdDestination);
        trElem.append(tdFrequency);
        trElem.append(tdNextArrival);
        trElem.append(tdMinutesAway);

        tbodyElem.append(trElem);
    })
});