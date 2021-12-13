// initialize our parsed_csv to be used wherever we want
var parsed_csv;
var start_time, end_time;
var _aData = [];
var _notInitializedYet = true;

// document.ready
$(function () {
    $('.showReport').on('click', function (e) {
        e.preventDefault();
        prepareTheReportsAndNavigateNextPage()
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

function prepareTheReportsAndNavigateNextPage() {
    $.LoadingOverlay("show");

    var oReports = {
        iNumberOfItems: $("#inputNumberOfItems").val(),
        weHaveReportsToShow: false,
        aTopBySpins: null,
        aTopByListeners: null,
        TopAlbumsBySpins: $("#TopAlbumsBySpins").is(":checked"),
        TopArtistsBySpins: $("#TopArtistsBySpins").is(":checked"),
        TopTracksBySpins: $("#TopTracksBySpins").is(":checked"),
        TopAlbumsByListeners: $("#TopAlbumsByListeners").is(":checked"),
        TopArtistsByListeners: $("#TopArtistsByListeners").is(":checked"),
        TopTracksByListeners: $("#TopTracksByListeners").is(":checked")
    }

    if ($("#TopAlbumsBySpins").is(":checked") || $("#TopArtistsBySpins").is(":checked") || $("#TopTracksBySpins").is(":checked")) {
        prepareReport("spins", oReports);
    }

    if ($("#TopAlbumsByListeners").is(":checked") || $("#TopArtistsByListeners").is(":checked") || $("#TopTracksByListeners").is(":checked")) {
        prepareReport("listeners", oReports);
    }

    $.LoadingOverlay("hide");

    if (oReports.weHaveReportsToShow) {
        localStorage.setItem('oReports', JSON.stringify(oReports));
        $(window).attr('location', 'reports.html')
    }
}

function prepareReport(sType, oReports) {
    switch (sType) {
        case "spins":
            oReports.aTopBySpins = reportSpins();
            if (oReports.aTopBySpins) {
                oReports.weHaveReportsToShow = true;
            }
            break;
        case "listeners":
            oReports.aTopByListeners = reportListeners();
            if (oReports.aTopByListeners) {
                oReports.weHaveReportsToShow = true;
            }
            break;
    }
}

function reportSpins() {
    var iNumberOfItems = $("#inputNumberOfItems").val();
    var arr = [];
    if (iNumberOfItems > 0) {
        _aData.sort((a, b) => (a["PLAY FREQUENCY"] < b["PLAY FREQUENCY"] ? 1 : -1))
        var iCount = 0;
        do {
            if (_aData[iCount]["NAME OF SERVICE"]) {
                arr.push(_aData[iCount]);
            }
            iCount++;
        } while (arr.length < iNumberOfItems);

    }
    return arr;
}

function reportListeners() {
    var iNumberOfItems = $("#inputNumberOfItems").val();
    var arr = [];
    if (iNumberOfItems > 0) {
        _aData.sort((a, b) => (a["ACTUAL TOTAL PERFORMANCES"] < b["ACTUAL TOTAL PERFORMANCES"] ? 1 : -1))
        var iCount = 0;
        do {
            if (_aData[iCount]["NAME OF SERVICE"]) {
                arr.push(_aData[iCount]);
            }
            iCount++;
        } while (arr.length < iNumberOfItems);
    }
    return arr;
}

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
    $("#zrq-search").val("");
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

        $('input[type=radio]').change(function () {
            $("#zrq-search").val("");
        })

        $('#btnClearFilter').on('click', function (e) {
            e.preventDefault();
            clearFilter();
        })

        $('#zrq-search').on('keyup', function (oEvent) {
            var sValue = $(this).val();
            if (oEvent.keyCode === 27) {
                $("#zrq-search").val("");
                $("#myTable thead").remove();
                $("#myTable tbody").remove();
                buildTable();
            } else {
                if (sValue.length >= 2) {
                    if ($('#rbArtist').is(':checked')) {
                        filterTable(sValue, "artist");
                    }
                    if ($('#rbSong').is(':checked')) {
                        filterTable(sValue, "song");
                    }
                    if ($('#rbAlbum').is(':checked')) {
                        filterTable(sValue, "album");
                    }
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


