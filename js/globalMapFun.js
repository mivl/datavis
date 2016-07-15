var activeBtn = 0;
var t1 = document.getElementById("t1");
var t2 = document.getElementById("t2");
var t3 = document.getElementById("t3");
var t4 = document.getElementById("t4");
var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");
var p4 = document.getElementById("p4");

function updateSoftwareEngineer() {
  t1.className = "center header orange-text";
  t2.className = "center header grey-text";
  t3.className = "center header grey-text";
  t4.className = "center header grey-text";
  p1.className = "light";
  p2.className = "grey-text";
  p3.className = "grey-text";
  p4.className = "grey-text";
  if(activeBtn != 1) {
    activeBtn = 1;
    loadMap();
  }
}

function updateWebDeveloper() {
  t1.className = "center header grey-text";
  t2.className = "center header orange-text";
  t3.className = "center header grey-text";
  t4.className = "center header grey-text";
  p1.className = "grey-text";
  p2.className = "light";
  p3.className = "grey-text";
  p4.className = "grey-text";
  if(activeBtn != 2) {
    activeBtn = 2;
    loadMap();
  }
}

function updateDataAnalyst() {
  t1.className = "center header grey-text";
  t2.className = "center header grey-text";
  t3.className = "center header orange-text";
  t4.className = "center header grey-text";
  p1.className = "grey-text";
  p2.className = "grey-text";
  p3.className = "light";
  p4.className = "grey-text";
  if(activeBtn != 3) {
    activeBtn = 3;
    loadMap();
  }
}

function updateNetworkEngineer() {
  t1.className = "center header grey-text";
  t2.className = "center header grey-text";
  t3.className = "center header grey-text";
  t4.className = "center header orange-text";
  p1.className = "grey-text";
  p2.className = "grey-text";
  p3.className = "grey-text";
  p4.className = "light";
  if(activeBtn != 4) {
    activeBtn = 4;
    loadMap();
  }
}