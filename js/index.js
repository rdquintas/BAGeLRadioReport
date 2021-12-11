// initialize our parsed_csv to be used wherever we want
var parsed_csv;
var start_time, end_time;

// document.ready
$(function () {
    $('.showReport').on('click', function (e) {
        e.preventDefault();
        $(window).attr('location','reports.html')
    })

    $('.load-file').on('click', function (e) {
        e.preventDefault();
        start_time = performance.now();
        $('#report').text('Processing...');


        var worker = new Worker('js/worker.js');
        worker.addEventListener('message', function (ev) {
            //  console.log('received raw CSV, now parsing...');

            // Parse our CSV raw text
            Papa.parse(ev.data, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    // Save result in a globally accessible var
                    parsed_csv = results;
                    buildTable(results.data);
                    //$('#report').text(parsed_csv.data.length + ' rows processed');
                    end_time = performance.now();
                    ///console.log('Took ' + (end_time - start_time) + " milliseconds to load and process the CSV file.")
                }
            });

            // Terminate our worker
            worker.terminate();
        }, false);

        // Submit our file to load
        var file_to_load = document.getElementById("myFile").files[0];

        //  console.log('call our worker');
        worker.postMessage({ file: file_to_load });
    });

});



function buildTable(aData) {
    if (aData) {
        var oTable = $("#myTable");
        var str = "<table class='table table-striped'>";
        str += "<thead>";
        str += "<tr>";
        str += "<th scope='col'>Artist</th>";
        str += "<th scope='col'>Song</th>";
        str += "<th scope='col'>Album</th>";
        str += "<th scope='col'>Performances</th>";
        str += "<th scope='col'>Play freq.</th>";
        str += "</tr>";
        str += "</thead>";
        str += "<tbody>";
        for (let i = 0; i < aData.length; i++) {
            var obj = aData[i];
            var arr = [];
            if (obj["FEATURED ARTIST"] === "" || obj["SOUND RECORDING TITLE"] === "") {
                continue;
            }

            if (obj["SOUND RECORDING TITLE"]) {
                arr = obj["SOUND RECORDING TITLE"].split("-");
            }

            str += "<tr>";

            str += "<td>";
            str += obj["FEATURED ARTIST"];
            str += "</td>";

            str += "<td>";
            str += arr[0] ? arr[0] : "";
            str += "</td>";

            str += "<td>";
            str += arr[1] ? arr[1] : "";
            str += "</td>";

            str += "<td>";
            str += obj["ACTUAL TOTAL PERFORMANCES"];
            str += "</td>";

            str += "<td>";
            str += obj["PLAY FREQUENCY"];
            str += "</td>";

            str += "</tr>";
        }
        str += "</tbody>";
        str += "</table>";

        oTable.html(str);

        var oForm = $("#formReport");
        oForm.removeClass("invisible");
        oForm.addClass("visible");
    }

}