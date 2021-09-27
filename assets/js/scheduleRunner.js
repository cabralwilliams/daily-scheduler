var thisDay = moment().format("dddd, MMMM D, YYYY");
$("#currentDay").text(thisDay);
var startOfDay = moment().startOf("day");
console.log(JSON.stringify(startOfDay));

var todaysActivities = JSON.parse(localStorage.getItem("todaysActivities")) || ["","","","","","","","",""];

function saveTodaysActivities() {
    localStorage.setItem("todaysActivities",JSON.stringify(todaysActivities));
}

var activityStyleClass = "col-10 ";
var isEditing = false;

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
    timeDiv.className = "col-1 hour";
    timeDiv.textContent = timeString;
    var activityDiv = document.createElement("div");
    activityDiv.setAttribute("data-activity",timeOfDay);
    activityDiv.setAttribute("containsInput", false);
    activityDiv.id = "hour" + timeOfDay;
    activityDiv.setAttribute("onclick", "createInput(" + timeOfDay + ")");
    var activityClass = "activity-div col-10 ";
    var rightNow = moment();
    var thisHour = moment().startOf("day").add(timeOfDay, "hours");
    var activitySegmentClass = activityStyleClass;
    //console.log(thisHour.diff(rightNow));
    if(thisHour.diff(rightNow) < -3600000) {
        activityDiv.setAttribute("data-when", "past");
        activitySegmentClass += "past";
        activityClass += "alert-dark";
    } else if(thisHour.diff(rightNow) < 0) {
        activityDiv.setAttribute("data-when", "present");
        activitySegmentClass += "present";
        activityClass += "bg-danger";
    } else {
        activityDiv.setAttribute("data-when", "future");
        activitySegmentClass += "future";
        activityClass += "bg-success";
    }
    //activityDiv.className = activityClass;
    activityDiv.className = activitySegmentClass;
    //var activitySpan = document.createElement("span");
    //activitySpan.textContent = activity;
    activityDiv.textContent = activity;
    //activityDiv.appendChild(activitySpan);
    var saveButton = document.createElement("button");
    saveButton.className = "col-1 btn btn-primary saveBtn";
    saveButton.setAttribute("data-hour",timeOfDay);
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    scheduleRow.appendChild(timeDiv);
    scheduleRow.appendChild(activityDiv);
    scheduleRow.appendChild(saveButton);
    return scheduleRow;
}

function loadSchedule() {
    document.querySelector(".container").innerHTML = "";
    for(var i = 9; i < 18; i++) {
        var nextRow = timeBlock(i,todaysActivities[i - 9]);
        document.querySelector(".container").appendChild(nextRow);
    }
}

function createInput(hourInput) {
    if(!isEditing) {
        isEditing = true;
        var inputBox = document.createElement("textarea");
        //var classStr = "col-12 ";
        var classStr = "col-10 ";
        inputBox.setAttribute("data-hour", hourInput);
        //var spanElement = document.querySelector("#hour" + hourInput).querySelector("span") || null;
        var slotIsWhen = document.querySelector("#hour" + hourInput).getAttribute("data-when");
        var currentActivity = document.querySelector("#hour" + hourInput).textContent.trim();
        inputBox.setAttribute("isediting", true);
        //if(spanElement !== null) {
            //var currentActivity = spanElement.textContent.trim();
            classStr += slotIsWhen;
            /*
            switch(slotIsWhen) {
                case "past":
                    classStr += "alert-dark";
                    break;
                case "present":
                    classStr += "bg-danger";
                    break;
                case "future":
                    classStr += "bg-success";
                    break;
            }
            */
            inputBox.className = classStr;
            inputBox.placeholder = currentActivity;
            inputBox.textContent = currentActivity;
            inputBox.setAttribute("data-when", slotIsWhen);
            inputBox.id = "hour" + hourInput;
            //document.querySelector("#hour" + hourInput).querySelector("span").replaceWith(inputBox);
            document.querySelector("#hour" + hourInput).replaceWith(inputBox);
        //}
    }
}

$("button").on("click", function() {
    var index = parseInt($(this).attr("data-hour")) - 9;
    console.log(index);
    alert(index);
    var textInput = $(this)
        .closest(".row")
        .closest("input") || null;
    if(textInput !== null) {

    }
})

var saveAppointment = function(event) {
    if(event.target.matches(".btn")) {
        if(isEditing) {
            var buttonId = parseInt(event.target.getAttribute("data-hour"));
            console.log(buttonId);
            var inputBox = document.querySelector("#hour" + buttonId) || null;
            var classStr = activityStyleClass + document.querySelector("#hour"+ buttonId).getAttribute("data-when");
            if(inputBox.hasAttribute("isediting")) {
                var appointment = inputBox.value;
                //var spanElement = document.createElement("span");
                //spanElement.textContent = appointment;
                var divElement = document.createElement("div");
                divElement.id = "hour" + buttonId;
                divElement.className = classStr;
                divElement.textContent = appointment;
                todaysActivities[buttonId - 9] = appointment;
                //document.querySelector("#hour" + buttonId).querySelector("textarea").replaceWith(spanElement);
                document.querySelector("#hour" + buttonId).replaceWith(divElement);
                saveTodaysActivities();
                loadSchedule();
                isEditing = false;
            }
        }
    }
}

$(".container").on("click", "button", saveAppointment);

loadSchedule();

setInterval(function() {
    loadSchedule();
},30*60*1000);