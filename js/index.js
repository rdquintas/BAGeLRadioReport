// initialize our parsed_csv to be used wherever we want
var parsed_csv;
var start_time, end_time;
var _aData = [];
var _notInitializedYet = true;

// document.ready
$(function () {
    $('.showReport').on('click', function (e) {
        e.preventDefault();
        $(window).attr('location', 'reports.html')
    })

    $('.loadAnother').on('click', function (e) {
        e.preventDefault();
        $(window).attr('location', 'index.html')
    })

    $('#myFile').on("change", function (e) {
        $.LoadingOverlay("show");
        e.preventDefault();
        start_time = performance.now();



        var worker = new Worker('js/worker.js');
        worker.addEventListener('message', function (ev) {

            // Parse our CSV raw text
            Papa.parse(ev.data, {
                header: true,
                dynamicTyping: true,
                error: function (err, file, inputElem, reason) {
                    $.LoadingOverlay("hide");
                },
                complete: function (results) {
                    $.LoadingOverlay("hide");
                    // Save result in a globally accessible var
                    parsed_csv = results;
                    _aData = results.data;
                    buildTable();
                    end_time = performance.now();
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



function buildTable(aFilteredItems) {
    $.LoadingOverlay("show");
    var aItems = []
    if (aFilteredItems) {
        aItems = aFilteredItems;
    } else {
        aItems = _aData;
    }

    if (aItems) {
        try {
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
            for (let i = 0; i < aItems.length; i++) {
                var obj = aItems[i];
                var arr = [];
                if (obj["FEATURED ARTIST"] === "" || obj["SOUND RECORDING TITLE"] === "") {
                    continue;
                }

                if (obj["SOUND RECORDING TITLE"]) {
                    if (typeof obj["SOUND RECORDING TITLE"] !== "string") {
                        obj["SOUND RECORDING TITLE"] = obj["SOUND RECORDING TITLE"].toString()
                    }
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

            var oFormSelScreen = $("#formSelectionScreen");
            var oFormReport = $("#formReport");
            var oFormSearch = $("#searchForm");

            oFormSelScreen.hide();
            oFormReport.show();
            oFormSearch.show();
            initializeEvents();
            $.LoadingOverlay("hide");
        } catch (oError) {
            $.LoadingOverlay("hide");
            showError("Something wrong with the file: " + JSON.stringify(oError));
        }
    }
}

function showError(str) {
    var oPopup = $("#zrqError");
    var oText = $("#errorText");
    oText.html(str);
    oPopup.show()
}

function clearFilter() {
    $("#zrq-search-artist").val("");
    $("#zrq-search-song").val("");
    $("#zrq-search-album").val("");
    $("#myTable thead").remove();
    $("#myTable tbody").remove();
    buildTable();
}

function onCloseModalClick() {
    var oPopup = $("#zrqError");
    oPopup.hide()
}


function initializeEvents() {
    if (_notInitializedYet) {

        _notInitializedYet = false;

        $('#btnClearFilter').on('click', function (e) {
            e.preventDefault();
            clearFilter();
        })

        $('#zrq-search-artist').on('keyup', function (oEvent) {
            var sValue = $(this).val();
            if (oEvent.keyCode === 27) {
                $("#zrq-search-artist").val("");
                $("#myTable thead").remove();
                $("#myTable tbody").remove();
                buildTable();
            } else {
                if (sValue.length >= 2) {
                    $("#zrq-search-song").val("");
                    $("#zrq-search-album").val("");
                    filterTable(sValue, "artist");
                }
            }
        });

        $('#zrq-search-song').on('keyup', function (oEvent) {
            var sValue = $(this).val();
            if (oEvent.keyCode === 27) {
                $("#zrq-search-song").val("");
                $("#myTable thead").remove();
                $("#myTable tbody").remove();
                buildTable();
            } else {
                if (sValue.length >= 2) {
                    $("#zrq-search-artist").val("");
                    $("#zrq-search-album").val("");
                    filterTable(sValue, "song");
                }
            }
        });

        $('#zrq-search-album').on('keyup', function (oEvent) {
            var sValue = $(this).val();
            if (oEvent.keyCode === 27) {
                $("#zrq-search-album").val("");
                $("#myTable thead").remove();
                $("#myTable tbody").remove();
                buildTable();
            } else {
                if (sValue.length >= 2) {
                    $("#zrq-search-artist").val("");
                    $("#zrq-search-song").val("");
                    filterTable(sValue, "album");
                }
            }
        });
    }
}
function filterTable(sValue, sColumnToFilter) {
    var rePattern = new RegExp(sValue, "i");
    var arr = $(_aData)
        .filter(function (i, n) {
            var str = "";
            switch (sColumnToFilter) {
                case "artist":
                    str = n["FEATURED ARTIST"];
                    str = str ? str : "";
                    str = str.toString();
                    break;
                case "song":
                    str = n["SOUND RECORDING TITLE"];
                    str = str ? str : "";
                    str = str.toString();
                    var arr = str.split("-");
                    if (arr[0]) {
                        str = arr[0];
                    }
                    break;
                case "album":
                    str = n["SOUND RECORDING TITLE"];
                    str = str ? str : "";
                    str = str.toString();
                    var arr = str.split("-");
                    if (arr[1]) {
                        str = arr[1];
                    }
                    break;
            }

            return str.search(rePattern) !== -1;
        });

    $("#myTable").html("");
    buildTable(arr);
}


