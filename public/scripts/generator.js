
/*
 * CSV GENERATOR
 */
var userData = ["description", "course", "college", "department", "tags"];
var currentObject = {};
var csvData = {};
var current = {};
var currentStep = 0;
var dir = 1;

localStorage.paths = JSON.stringify(["hello/hello.txt","hello/dir/dir.txt"]);//,"hello/dir/dry.txt","hello/dir/dirt.txt"]);
var paths = JSON.parse(localStorage.paths);
var currentPath = 0;




function start(){
    console.log(paths);
    $("#gfile").text(paths[currentPath]);
    goThroughProcess();
}

function goThroughProcess(){
    console.log(currentStep);
    var currentProcess =  process[currentStep];
    if(currentProcess.userInput == "Yes")
        fillWithFileData(currentProcess);
    else{

        (dir == 1) ? autoFill() : back();
    }
}


function generateCSV(csvData){

}

function autoFill(){

    var name = (process[currentStep].name);
    console.log(name);

    if(name == "pathname")
        current[name] = paths[currentPath];

    if(name == "identifier")
        current[name] = "";
    if(name == "transcript avaliable")
        current[name] = ""
    if(name == "closed caption")
        current[name] = "";
    if(name == "Restriction")
        current[name] = "BYU-Idaho";
    if(name == "Copyright Statement")
        current[name] = "Yes";
    if(name == "license")
        current[name] = "Creative Commons";


     if((currentStep < process.length-1))
         currentStep++
         goThroughProcess();
}

function next(){
    if($("#ginput").val() == ""){
        return;
    }
    dir = 1;
    if((currentStep < process.length-1)){

        current[process[currentStep].name]=$("#ginput").val();
        currentStep++;
        $("#ginput").val((current[process[currentStep].name])? current[process[currentStep].name] : "a");
        $("#ginput").focus();
        goThroughProcess()
        $("#gback").css("visibility","visible");
    }else if (currentStep == process.length-1) currentStep++;

    if((currentStep >= process.length-2))
        $("#gnext").css("visibility","hidden");

    if((currentStep > process.length-1)){
        var shouldGo = confirm("Are you sure you would like to submit this file to Equella?");
        if(shouldGo)
            movetoNext();
    }

    if(currentStep <= 2)$("#gback").css("visibility","hidden");
}

function movetoNext(){

    csvData[paths[currentPath]] = current;
    current = {};
    currentStep = 0;
    currentPath++;

    if(currentPath >= paths.length){
        console.log("The End!");
        writeCSV();
    }
    else{
        $("#gfile").text(paths[currentPath]);
        goThroughProcess();
    }
}

function back(){

     dir = 0;
    if(currentStep >= process.length-1){
        currentStep--;
        back();
        return;
    }

    console.log(currentStep);

    if((currentStep > 2)){
        current[process[currentStep].name]=$("#ginput").val();
        currentStep--;
        $("#ginput").val((current[process[currentStep].name] ) ? (current[process[currentStep].name]) : "");
        goThroughProcess()
        $("#gnext").css("visibility","visible");
    }
    if(currentStep <= 2)$("#gback").css("visibility","hidden");

}


var fileVariable = function(name,description,example,required,userInput){
    this.name = name;
    this.description = description;
    this.example = example;
    this.required = required;
    this.userInput = userInput;
}

var process = [

    new fileVariable( 'pathname'	,'This is the path to the file being uploaded.',	'-',	'Yes',	'No'),

   new fileVariable( 'identifier'	,'his is the unique identifier assigned to the specific file that will be used when pushing an update .',	'-',	'Yes',	'No'),

    new fileVariable('Title'	,'This is the name of the file on the Equella server. This is what people will be typing into the search box to find the file on the server so please be specific.', 	"SAN 101 (Online) - Syllabus",	'Yes',	'Yes'),

    new fileVariable('Description'	,'This tells people what the file is and its role in the course.', 	"This file is used in Lesson X in all sections of SAN 101",	'Yes',	'Yes'),

    new fileVariable('College'	,'Under what college does the file\'s course course belong to?', 	"Bussiness and Communication",	'Yes',	'Yes'),

   new fileVariable( 'Department'	,'Under what department does the file\'s course belong to?',	"Computer Information Technology",	'Yes',	'Yes'),

   new fileVariable( 'Course'	,'This is the name of the course that the file is found in.',	"SAN 101",	'Yes',	'Yes'),

    new fileVariable('Format'	,'This is the type for the media being uploaded. Please specify what type of file this is.',	"Document, Presentation, Image or Photo, Video, Audio, Web page, Spreadsheet",	'Yes',	'Yes'),

   new fileVariable( 'transcript avaliable','-',	'-',	'No',	'No'),

   new fileVariable( 'closed caption'	,'-',	'-',	'No',	'No'),

    new fileVariable('Tags'	,'These are keywords that help people find the file in the server when they type them into the searchbox. Please choose only a few words that you feel best describe the file in question. Please separate the groups of words with a comma .',	"<br>File Name: Andrew.Gremlich <br> \n Keywords:<br> Tech Wizard, Mac Lover, Web Developer, Jimmy John's Fanatic", 'Yes'	,'Yes'),

    new fileVariable('Restriction'	,'This is tells us if someone needs to be logged into their BYU-I account to view the content.',	"BYU - Idaho or Public",	'Yes',	'No'),

    new fileVariable('Copyright Owner'	,'This tells us who the owner of the file is.', 	"BYU-Idaho,  3rd Party or Publisher, LDS or BYU,  Self"	,'Yes'	,'Yes'),

    new fileVariable('Copyright Statement'	,'This is the option to copyright the file if it is our original work.',	"Yes , No",	'Yes',	'No'),

   new fileVariable( 'license'	,'This should always be creative commons so we are just going to do this automaticially',	'Creative Commons',	'Yes',	'No'),

    new fileVariable('Contributor  Name'	,'Please put your name here','If you dont know your name you should probably be working somewhere else.',	'Yes',	'Yes')
];

start();

function fillWithFileData(file){
    $("#gtitle").text(file.name);
    $("#gdes").html(`${file.description}`);
    $("#gexe").html(`<strong>Example: "${file.example}"</strong>`)
}


$("#ginput").keypress((e) => {
    //console.log(e);
    if(e.charCode == 13)
        next();
});

$("#ginput").keyup((e) => {
   // console.log(e);
    if(e.charCode == 0 && $("#ginput").val() == "")
        back();;
});


function removeEnter(word)
{
    var myWord = word,
        replace = myWord.replace(/[\n]/g, "");
    return replace;
}

function writeCSV(){

    var csvCompile = {};
    for(var i in process){
        var currentName = process[i].name;
        csvCompile[currentName] = "";
        for(var x in csvData)
           csvCompile[currentName] += (csvData[x][process[i].name]) ? `${csvData[x][process[i].name]}|` : "";
    }
    console.log(csvCompile);
    var csv = "";
    for(var i in csvCompile){
        var c = csvCompile[i];
        csv += `${c.substr(0,c.length-1)},`
    }
    csv = csv.substr(0, csv.length-2);
    csv=`${removeEnter(csv)},,`;
    console.log(csv);

    window.webkitRequestFileSystem(TEMPORARY, 900 * 1024 * 1024, (fs) => {
        log(fs);



        var courseName = removeEnter(csvCompile["Course"].split("|")[0]);
        $.get("https://script.google.com/macros/s/AKfycbwWWoXqXaU3s5Gpk8L4SXQDFVADh60wrS21PSJ_f7X12BiEjTzJ/exec",{parameter:`${csv}!/*$SPLITTER$*/${courseName}`},function(e){
            console.log(e);
        });
        fs.root.getFile(`${courseName}.csv`, {
            create: true
            , exclusive: false
        }, (entry) => {
            log(entry.fullPath);
            entry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    console.log('Write completed.');
                };
                fileWriter.onerror = function (e) {
                    console.log('Write failed: ' + e.toString());
                };
                // Create a new Blob and write it to log.txt.
                var blob = new Blob([csv], {
                    type: 'text/plain'
                });
                fileWriter.write(blob);
            }, EH);

            entry.file((file) => {
                var reader = new FileReader();
                reader.onloadend = function (e) {
//                    var txtArea = document.createElement('textarea');
//                    txtArea.value = this.result;
//                    document.body.appendChild(txtArea);
                };
                reader.readAsText(file);
            }, EH);

            $("#generator").html(`<h1>CSV for "${courseName}" has been Successfully Generated!</h1><a href = "${entry.toURL()}" download> Click here to download. </a>`)



        }, EH);
    });

    function EH(e) {
        console.error(e);
    }

    function log(e) {
        console.log(e);
    }
}


/*
window.webkitRequestFileSystem(TEMPORARY, 900 * 1024 * 1024, (fs) => {
    log(fs);
    fs.root.getFile('log.csv', {
        create: true
        , exclusive: false
    }, (entry) => {
        log(entry.fullPath);
        entry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function (e) {
                console.log('Write completed.');
            };
            fileWriter.onerror = function (e) {
                console.log('Write failed: ' + e.toString());
            };
            // Create a new Blob and write it to log.txt.
            var blob = new Blob(['Lorem Ipsum\nWasup,peeps,this\nis,a,new,row'], {
                type: 'text/plain'
            });
            fileWriter.write(blob);
        }, EH);

        entry.file((file) => {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var txtArea = document.createElement('textarea');
                txtArea.value = this.result;
                document.body.appendChild(txtArea);
            };
            reader.readAsText(file);
        }, EH);

        $("body").append(`<a href = "${entry.toURL()}" download> TESTING!!! </a>`)



    }, EH);
});

function EH(e) {
    console.error(e);
}

function log(e) {
    console.log(e);
}
*/



