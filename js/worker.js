self.addEventListener('message', function(e) {
    console.log('worker is running');

    var file = e.data.file;
    var reader = new FileReader();

    reader.onload = function (fileLoadedEvent) {
        console.log('file loaded, posting back from worker');

        var textFromFileLoaded = fileLoadedEvent.target.result;

        // Post our text file back from the worker
        self.postMessage(textFromFileLoaded);
    };

    // Actually load the text file
    reader.readAsText(file, "UTF-8");
}, false);