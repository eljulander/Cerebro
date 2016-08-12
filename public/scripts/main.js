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
