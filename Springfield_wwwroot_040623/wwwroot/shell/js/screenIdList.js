// ---- screenIdList ----
// builds an easily visible list of screen ids on an html page

var ErrorText = "Error: Could not find the igt-nexgen-codes. Please check if shell contains ../lib/codes/lib/screenIds.js";
var TitleText = "List of Screen Trigger IDs";

var ScreenIdObjects = {};
var TableElement;

function buildPageFromCodes(e) {
    if (e){
        ScreenIdObjects = e;
        document.getElementById("tableTitle").innerHTML = TitleText;
        TableElement = document.getElementById("screenTable");
    }
    else{
        document.getElementById("tableLabelRows").style.display = "none";
        document.getElementById("tableTitle").innerHTML = ErrorText;
    }
    var counter = 0;
    for(var Obj in ScreenIdObjects)
    {
        if (Obj !== "getText") {
            var TableRow = document.createElement("TR");
            var TableCol1 = document.createElement("TD");
            var TableCol2 = document.createElement("TD");
            var TableCol3 = document.createElement("TD");

            TableCol1.innerHTML = Obj;
            TableCol2.innerHTML = ScreenIdObjects[Obj];
            TableCol2.style.textAlign = "center";
            TableCol3.innerHTML = e.getText(ScreenIdObjects[Obj]);

            TableRow.appendChild(TableCol1);
            TableRow.appendChild(TableCol2);
            TableRow.appendChild(TableCol3);
            
            if (counter % 2 === 1){
                TableRow.style.backgroundColor = "#ffdca9";
            }
            else {
                TableRow.style.backgroundColor ="#ffffff";
            }
            TableElement.appendChild(TableRow);
            counter ++;
        }
    }
}