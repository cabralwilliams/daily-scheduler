var thisDay = moment().format("dddd, MMMM D, YYYY");
$("#currentDay").text(thisDay);
var startOfDay = moment().startOf("day");
console.log(JSON.stringify(startOfDay));

var todaysActivities = JSON.parse(localStorage.getItem("todaysActivities")) || ["","","","","","","","",""];

var timeBlock = function(timeOfDay, activity) {
    var scheduleRow = document.createElement("div");
    scheduleRow.className = "row";
    var timeString;
    if(timeOfDay < 12) {
        timeString = timeOfDay + " AM";
    } else if(timeOfDay === 12) {
        timeString = timeOfDay + " PM";
    } else {
        timeString = (timeOfDay - 12) + " PM";
    }
    var timeDiv = document.createElement("div");
    timeDiv.className = "col-1";
    timeDiv.textContent = timeString;
    var activityDiv = document.createElement("div");
    activityDiv.setAttribute("data-activity",timeOfDay);
    activityDiv.setAttribute("containsInput", false);
    activityDiv.id = "hour" + timeOfDay;
    activityDiv.setAttribute("onclick", "createInput(" + timeOfDay + ")");
    var activityClass = "activity-div col-10 ";
    var rightNow = moment();
    var thisHour = moment().startOf("day").add(timeOfDay, "hours");
    //console.log(thisHour.diff(rightNow));
    if(thisHour.diff(rightNow) < -3600000) {
        activityClass += "alert-dark";
    } else if(thisHour.diff(rightNow) < 0) {
        activityClass += "bg-danger";
    } else {
        activityClass += "bg-success";
    }
    activityDiv.className = activityClass;
    var activitySpan = document.createElement("span");
    activitySpan.textContent = activity;
    //activityDiv.textContent = activity;
    activityDiv.appendChild(activitySpan);
    var saveButton = document.createElement("button");
    saveButton.className = "col-1 btn btn-primary";
    saveButton.setAttribute("data-hour",timeOfDay);
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    scheduleRow.appendChild(timeDiv);
    scheduleRow.appendChild(activityDiv);
    scheduleRow.appendChild(saveButton);
    return scheduleRow;
}

function loadSchedule() {
    for(var i = 9; i < 18; i++) {
        var nextRow = timeBlock(i,todaysActivities[i - 9]);
        document.querySelector(".container").appendChild(nextRow);
    }
}

function createInput(hourInput) {
    var inputBox = document.createElement("input");
    inputBox.className = "col-12";
    inputBox.setAttribute("data-hour", hourInput);
    var spanElement = document.querySelector("#hour" + hourInput).querySelector("span") || null;
    if(spanElement !== null) {
        document.querySelector("#hour" + hourInput).querySelector("span").replaceWith(inputBox);
    }
}

$("button").on("click", function() {
    var textInput = $(this)
        .closest(".row")
        .closest("input") || null;
    if(textInput !== null) {

    }
})

loadSchedule();