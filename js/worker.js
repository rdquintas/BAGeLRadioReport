self.addEventListener('message', function(e) {

    var file = e.data.file;
    var reader = new FileReader();

    reader.onload = function (fileLoadedEvent) {

        var textFromFileLoaded = fileLoadedEvent.target.result;

        // Post our text file back from the worker
        self.postMessage(textFromFileLoaded);
    };

    // Actually load the text file
    reader.readAsText(file, "UTF-8");
}, false);