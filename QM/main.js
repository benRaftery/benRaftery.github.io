/*function initPatient() {
    var person = {
        firstName:"John",
        lastName:"Doe",
        age:50,
        eyeColor:"blue"
    };
    return person;
}*/

/*javascript:(function(){var div = document.createElement("div"); var script = document.createElement("script");
    
    script.src='main.js';
    document.body.insertBefore(script, document.body.firstChild);
    document.body.insertBefore(div, document.body.firstChild);
    div.innerHTML = '<div class="QMInit"><button onclick="runDisplay()">Execute</button></div>';})();*/

function createNewPage () {
    var x=window.open();
    x.document.open();
    x.document.write('');
    x.document.close();
    return x;
}

function runDisplay () {
    var objectArray = buildClinic();
    drawTables(objectArray);
    //drawBasicOutput(b);
}

function numOfPatients (clinicArray, apptType) {
    var numOfType = 0;
    for(i=0;i<clinicArray.length;i++) {
        if(clinicArray[i].type == apptType) {
            numOfType += 1;
        }
    }
    return numOfType;
}

function tableExists(x, strSpecialty) {
    if(x.document.getElementById(strSpecialty)){
        return true;
    } else {
        return false;
    }
}

function drawTables (objectArray) {
    //IN: Array of named Arrays --> OUT: 
    var x=createNewPage();
    var currRowArray = [];
    var currClinic = "";

    var HTMLString = "";

    const headerColor = "#065687"
    const headerWidth = "800px"
    const smallWidth = "100px"

    for(i=0; i<objectArray.length; i++) {//for each clinic
        currClinic = objectArray[i].clinic;
        if(tableExists(x, currClinic)) {
            var table = x.document.getElementById(currClinic);
            HTMLString = table.innerHTML;
        } else {
            var table = insertTable(x, currClinic);
            x.document.body.insertBefore(table, x.document.body.nextSibling);
            var tableTitle = "<tr><td style='background-color:"+headerColor+"; width: "+headerWidth+";' colSpan=4 align='center'>"+currClinic+"</td></tr>";
            HTMLString = tableTitle+"<tr align='center'><td style='width: "+smallWidth+"'>Date</td><td>Clinic</td><td style='width: "+smallWidth+"'>NEW</td><td style='width: "+smallWidth+"'>REV</td></tr>";
        }
        
        HTMLString +="<tr><td align='center'>"+objectArray[i].date+"</td><td>"+objectArray[i].doctor+"</td><td align='center'>"+objectArray[i].newAppts+"</td><td align='center'>"+objectArray[i].revAppts+"</td></tr>";
        table.innerHTML = HTMLString;
    }
}

function insertTable(x, clinic) {
    var table = x.document.createElement("table");
    console.log(clinic);
    table.id = clinic;
    table.rules = "all";
    table.style.border = "1px solid black";
    table.style.margin = "30px 15px";
    return table;
}

function writeRowHTML(inArray) {
    //IN: {} named array (single row)
    const headerColor = "#065687"
    const headerWidth = "800px"
    var tableTitle = "<tr><td style='background-color:"+headerColor+"; width: "+headerWidth+";' colSpan=4 align='center'>"+inArray.clinic+"</td></tr>";
    var HTMLString = tableTitle+"<tr align='center'><td>Date</td><td>Clinic</td><td>NEW</td><td>REV</td></tr>";
    
    HTMLString += "<tr><td>"+inArray.date+"</td><td>"+inArray.clinic+"</td><td>"+inArray.newAppts+"</td><td>"+inArray.revAppts+"</td></tr>";

    return HTMLString;
}

function objClinicHelp (inArray) {
    var clinicData = {
        clinicName: inArray[0],
        doctorName: inArray[1],
        date: inArray[2],
        specialty: inArray[3]
    };
    return clinicData;
}

function buildClinic () {
    var clinic = pullClinicInfo(document);
    var patients = pullAllRows(document);
    var merged = [];

    var currentClinic = {}

    var currDoctor = "";
    var currClinic = ""
    var currPatients = [];

    if(clinic.length != patients.length) {alert("Something went wrong: 001")};
    
    for(doc=0; doc<clinic.length; doc++) {
        currentClinic = {
            doctor: clinic[doc].doctorName,
            clinic: clinic[doc].clinicName,
            date: clinic[doc].date,
            specialty: getSpecialty(clinic[doc].clinicName),
            newAppts: numOfPatients(patients[doc], "N"),
            revAppts: numOfPatients(patients[doc], "R"),
            patients: patients[doc].slice(1, patients[doc].length)//remove the headers
        }
        merged.push(currentClinic);
    }
    console.log(merged);
    return merged;
}

function dateClean(dString) {
    //remove: "Date: " from date
    const a = "Date - ";
    if(dString.indexOf(a) != -1){
        dString = dString.replace(a, "");
    }
    return dString;
}

function getSpecialty(inString) {
    var specialty = inString.split(" - ")[1];
    if(specialty.indexOf("DR") != -1) {
        specialty = specialty.split("DR")[0];
    } else if(specialty.indexOf("FELLOW") != -1) {
        specialty = specialty.split("FELLOW")[0];
    } else if(specialty.indexOf("REGISTRAR") != -1) {
        specialty = specialty.split("REGISTRAR")[0];
    }
    return specialty.trim();
}

function pullClinicInfo (theDocument) {
    //returns array of array of doctors
    var spanList = theDocument.getElementsByTagName('span');

    var currDoctor = "";
    var currClinic = "";
    var currDate = "";
    var currOArray = [];
    var currSpecialty = "";

    var doctorList = [];

    for(i=0; i<spanList.length; i++) {
        if(spanList[i].style.width == "550px") {

            currClinic = spanList[i].innerText;//take the clinic
            currDoctor = spanList[i+1].innerText;//take the doctor
            currDate = dateClean(spanList[i+2].innerText);//take the Date

            i+=2;//to skip checking these again
            currSpecialty = getSpecialty(currClinic);
            currOArray = [currClinic, currDoctor, currDate, currSpecialty];
            doctorList.push(objClinicHelp(currOArray));
        }
    }
    return doctorList;
}

function pullAllRows (theDocument) {
    var trList = theDocument.getElementsByTagName("tr");
    var rowList = [];
    //array.splice(x, 1);//at x remove 1
    for(x=0; x<trList.length; x++) {
        if(trList[x].style.height == "25px" || trList[x].style.height == "20px") {//25 is header
            rowList.push(trList[x]);//add row to appt array
        }
    }

    var headerLocations = findHeaders(rowList);
    var sortedRows = sortRows(headerLocations, rowList);

    return sortedRows;
}

function sortRows (headerLocations, rowList) {
    var currRow = [];//array of [header, row1, row2...]
    var sortedRows = [];//array of arrays

    for(i=0; i<(headerLocations.length-1); i++) {
        sortedRows.push(sortRow(i, i+1, headerLocations, rowList));
    }
    return sortedRows;
}

function extractFields (row) {
    //take tr and return {Type 0, Time 1, Name 3, URN 4, Comment 8}
    //add FAILSAFES here
    var tdList = row.getElementsByTagName('td');

    var patientData = {
        type: tdList[0].innerText,
        time: tdList[1].innerText,
        name: tdList[3].innerText,
        URN: tdList[4].innerText,
        comment: tdList[8].innerText
    };
    return patientData;
}

function sortRow(a, b, headerLocations, rowList) {
    var sortedRow = [];
    for(x=headerLocations[a]; x<(headerLocations[b]); x++) {
        sortedRow.push(extractFields(rowList[x]));
    }
    return sortedRow;
}

function findHeaders(rowList) {
    var headers = [];
    for(x=0; x<rowList.length; x++) {
        if(rowList[x].style.height == "25px") {//25 is header
            headers.push(x);//add id of header to array for later use
        };
    }

    var numberOfRows = rowList.length;
    headers.push(rowList.length);//add the last row for iterating later
    return headers;
}
