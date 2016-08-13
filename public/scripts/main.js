var isDone = true;
var paths = [];
function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
    // Get file
      isDone = true;
    item.file(function(file) {
      if((file.size /1048)/ 1048 > 0){
        console.log("File:", path + file.name);
          paths.push(path+file.name);
      }
    });
  } else if (item.isDirectory) {
    // Get folder contents
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {

      for (var i=0; i<entries.length; i++) {
          isDone = false;
        traverseFileTree(entries[i], path + item.name + "/");
      }
    });
  }
}

var dropArea =document.getElementById("dropArea");
dropArea.addEventListener("drop", function(event) {
  event.preventDefault();
  isDone =false;
  var items = event.dataTransfer.items;
  for (var i=0; i<items.length; i++) {
    // webkitGetAsEntry is where the magic happens
    var item = items[i].webkitGetAsEntry();
    if (item) {
      traverseFileTree(item);
    }
  }
     window.setTimeout(check,50);
}, false);

function check(){
    if(isDone){
        console.log("Finished");
        localStorage.paths = JSON.stringify(paths);
        console.log(paths);
        window.open("process.html");
    }else{
        window.setTimeout(check,50);
    }
}

$("html").on("dragover", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).addClass('dragging');
});

$("html").on("dragleave", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).removeClass('dragging');
});

$("html").on("drop", function(event) {
    event.preventDefault();
    event.stopPropagation();
    alert("Dropped!");
});
