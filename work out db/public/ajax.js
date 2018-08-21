
document.addEventListener("DOMContentLoaded", bindButtons);
document.addEventListener("DOMContentLoaded", requestMysql);

function bindButtons(){
  document.getElementById("infoSubmit").addEventListener("click",function(){
    var req = new XMLHttpRequest();

    //pack up the data that will be sent to the server
    var newData = {};
    newData.name = document.getElementById("name").value;
    newData.reps = document.getElementById("reps").value;
    newData.weight = document.getElementById("weight").value;
    newData.date = document.getElementById("date").value;

    var dropdown = document.getElementById("unit");
    var selected = dropdown.options[dropdown.selectedIndex].text;
    if(selected==="lbs")
      newData.lbs="1";
    else
      newData.lbs="0";

    //exit the function call if any field is left blank
    for (var para in newData){
      if(newData[para].length==0){
        event.preventDefault();
        return;
      }
    }

    newData = JSON.stringify(newData);

    //get connectted with the server
    req.open("POST","/insert",true);
    req.setRequestHeader("Content-Type", "application/json");

    //callback
    req.addEventListener("load",function(){
      if(req.status >= 200 && req.status < 400){

        //data responsed from server, which is the last record from DB
        var data = JSON.parse(req.responseText);

        //add the last record to table using DOM
        buildTable(data);
      } else {
        console.log("Error in network request: " + req.statusText);
    }});

    //send the data to server
    req.send(newData);

    event.preventDefault();
  })

}


function requestMysql(){
  var req = new XMLHttpRequest();

  //connect with server
  req.open("GET","/getData",true);
  req.setRequestHeader("Content-Type", "application/json");

  //callback
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){

      //set up the table by the data responsed from the server
      var data = JSON.parse(req.responseText);
      console.log(data);
      buildTable(data);

    } 
    else {
      console.log("Error in network request: " + req.statusText);
    }});

  req.send(null);

}


function editRow(e){

  //turn the edit button into save button
  document.getElementById("edit"+e.target.tracker).style.display="none";
  document.getElementById("save"+e.target.tracker).style.display="inline";
  
  //get the elements of tr
  var name = document.getElementById("name"+e.target.tracker);
  var reps = document.getElementById("reps"+e.target.tracker);
  var weight = document.getElementById("weight"+e.target.tracker);
  var date = document.getElementById("date"+e.target.tracker);
  var lbs = document.getElementById("lbs"+e.target.tracker);

  //append a input element in each tr in the row by changing tr's innerHTML
  name.innerHTML="<input type='text' id='name_text"+e.target.tracker+"' value='"+name.textContent+"'>";
  reps.innerHTML="<input type='text' id='reps_text"+e.target.tracker+"' value='"+reps.textContent+"'>";
  weight.innerHTML="<input type='text' id='weight_text"+e.target.tracker+"' value='"+weight.textContent+"'>";
  date.innerHTML="<input type='text' id='date_text"+e.target.tracker+"' value='"+date.textContent+"'>";
  lbs.innerHTML="<input type='text' id='lbs_text"+e.target.tracker+"' value='"+lbs.textContent+"'>";

  event.preventDefault();
}

function saveRow(e){


  //get the elements of input inside tr
  var nameText = document.getElementById("name_text"+e.target.tracker);
  var repsText = document.getElementById("reps_text"+e.target.tracker);
  var weightText = document.getElementById("weight_text"+e.target.tracker);
  var dateText = document.getElementById("date_text"+e.target.tracker);
  var lbsText = document.getElementById("lbs_text"+e.target.tracker);

  //get the elements of tr
  var name = document.getElementById("name"+e.target.tracker);
  var reps = document.getElementById("reps"+e.target.tracker);
  var weight = document.getElementById("weight"+e.target.tracker);
  var date = document.getElementById("date"+e.target.tracker);
  var lbs = document.getElementById("lbs"+e.target.tracker);

  //set up Ajax call
  var req = new XMLHttpRequest();

  //pack up the data that will be sent to the server
  var updateData = {};
  updateData.id = e.target.tracker;
  updateData.name = nameText.value;
  updateData.reps = repsText.value;
  updateData.weight = weightText.value;
  updateData.date = dateText.value;

  if(lbsText.value==="lbs")
    updateData.lbs = "1";
  else
    updateData.lbs="0";


  //exit the function call if any field is left blank
  for (var para in updateData){
    if(updateData[para].length==0){
      event.preventDefault();
      return;
    }
  }

  updateData = JSON.stringify(updateData);

  //get connectted with the server
  req.open("POST","/update",true);
  req.setRequestHeader("Content-Type", "application/json");

  //callback
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){

      //hide the save ; display edit
      document.getElementById("save"+e.target.tracker).style.display="none";
      document.getElementById("edit"+e.target.tracker).style.display="inline";

      name.innerHTML=nameText.value;
      reps.innerHTML=repsText.value;
      weight.innerHTML=weightText.value;
      date.innerHTML=dateText.value;
      lbs.innerHTML=lbsText.value;
    } else {
      console.log("Error in network request: " + req.statusText);
  }});

  //send the data to server
  req.send(updateData);

  event.preventDefault();
}

function deleteRow(e){

  var req = new XMLHttpRequest();

  //pack up the data that will be sent to the server
  var row = {};
  row.id = e.target.id
  row = JSON.stringify(row);

  //get connect with the server
  req.open("POST","/delete",true);
  req.setRequestHeader("Content-Type", "application/json");

  //callback
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){
      //remove the row in the table using DOM
      document.getElementById("row"+e.target.id).remove();
    } else {
      console.log("Error in network request: " + req.statusText);
    }});

  //send the data to server
  req.send(row);

  event.preventDefault();
}


function buildTable(data){

  var table = document.getElementById("workoutTable");

  for(var i=0;i<data.length;i++){

    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    var td6 = document.createElement("td");
    var form = document.createElement("form");
    var idTracker = document.createElement("input");
    var edit = document.createElement("input");
    var remove = document.createElement("input");
    var save = document.createElement("input");

    //assign tr a id and append it to table
    tr.id = "row" + data[i].id ; 
    table.appendChild(tr);


    //set up the row with the data pulled from DB
    td1.textContent=data[i].name;
    td1.id="name"+ data[i].id ; 
    tr.appendChild(td1);

    td2.textContent=data[i].reps;
    td2.id="reps"+ data[i].id ; 
    tr.appendChild(td2);

    td3.textContent=data[i].weight;
    td3.id="weight"+ data[i].id ; 
    tr.appendChild(td3);

    td4.textContent=data[i].date.substring(0,10);
    td4.id="date"+ data[i].id ; 
    tr.appendChild(td4);

    if(data[i].lbs==1)
      td5.textContent="lbs";
    else
      td5.textContent="kg";
    
    td5.id="lbs"+ data[i].id ; 
    tr.appendChild(td5);

    //add a delete button and a edit button as well as a hidden input
    idTracker.setAttribute("type", "hidden");
    idTracker.value = data[i].id;

    edit.setAttribute("type", "submit");
    edit.id="edit"+data[i].id ;
    edit.tracker = idTracker.value;
    edit.value = "edit";
    edit.addEventListener("click",editRow);

    remove.setAttribute("type", "submit");
    remove.value = "delete";
    remove.id = idTracker.value;
    remove.addEventListener("click",deleteRow);

    save.setAttribute("type", "submit");
    save.id="save"+data[i].id ;
    save.tracker = idTracker.value;
    save.value = "save";
    save.style.display="none";
    save.addEventListener("click",saveRow);

    //form.method = "post";
    //form.action = "http://flip3.engr.oregonstate.edu:6542/test";
    form.appendChild(idTracker);
    form.appendChild(save);
    form.appendChild(edit);
    form.appendChild(remove);
    td6.appendChild(form);
    tr.appendChild(td6);

  }
}