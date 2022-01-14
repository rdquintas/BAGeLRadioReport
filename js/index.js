// initialize our parsed_csv to be used wherever we want
var parsed_csv;
var start_time, end_time;
var _aData = [];
var _notInitializedYet = true;
var _oSort = {
    id: null,
    sortAscending: null
}

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
                    fixData();
                    buildTable(null, false);
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

function fixData() {
    var tempArr = [];
    var showWarningButton = false;
    var arr;
    var obj
    for (let i = 0; i < _aData.length; i++) {
        obj = _aData[i];

        if (obj["SOUND RECORDING TITLE"]) {
            if (typeof obj["SOUND RECORDING TITLE"] !== "string") {
                obj["SOUND RECORDING TITLE"] = obj["SOUND RECORDING TITLE"].toString()
            }
            arr = obj["SOUND RECORDING TITLE"].split("-");

            if (arr[0]) {
                obj["SOUND RECORDING TITLE"] = arr[0];
            }

            if (arr[1]) {
                obj["ALBUM TITLE"] = arr[1];
            }

            if (obj["ALBUM TITLE"] === "" || obj["ALBUM TITLE"] === " ") {
                showWarningButton = true
            }

            if (typeof obj["SOUND RECORDING TITLE"] !== "string") {
                obj["SOUND RECORDING TITLE"] = obj["SOUND RECORDING TITLE"].toString()
            }
            if (typeof obj["FEATURED ARTIST"] !== "string") {
                obj["FEATURED ARTIST"] = obj["FEATURED ARTIST"].toString()
            }
            if (typeof obj["ALBUM TITLE"] !== "string") {
                obj["ALBUM TITLE"] = obj["ALBUM TITLE"].toString()
            }
        }

        if (obj["FEATURED ARTIST"] !== undefined) {
            tempArr.push(obj);
        }
    }

    _aData = tempArr;

    var oWarningButton = $("#btnWarning");

    if (showWarningButton) {
        oWarningButton.show();
    } else {
        oWarningButton.hide();
    }

};

function showMissingInfo() {
    var arr = [];
    var obj;

    for (let i = 0; i < _aData.length; i++) {
        obj = _aData[i];

        if (obj["ALBUM TITLE"] === "" || obj["ALBUM TITLE"] === " ") {
            arr.push(obj);
        }
    }

    var oPopup = $("#zrqMissingAlbumInfo");
    var oUlMissing = $("#ulMissing");
    var oWarningTitle = $("#warningTitle");
    oWarningTitle.html("Total items with missing albums: " + arr.length);

    oUlMissing.empty();
    var str = "";

    for (let i = 0; i < arr.length; i++) {
        var obj = arr[i];
        str += "<li>";
        str += obj["FEATURED ARTIST"] + " / ";
        str += obj["SOUND RECORDING TITLE"];
        str += "</li>";
    }

    oUlMissing.html(str);
    oPopup.show()

};

function prepareTheReportsAndNavigateNextPage() {
    $.LoadingOverlay("show");

    var oReports = {
        iNumberOfItems: $("#inputNumberOfItems").val(),
        aTopAlbums: null,
        aTopArtists: null,
        aTopTracks: null,
    }

    oReports.aTopAlbums = mergeItemsBy("album");
    oReports.aTopArtists = mergeItemsBy("artist");
    oReports.aTopTracks = mergeItemsBy("track");

    $.LoadingOverlay("hide");

    if (oReports.aTopAlbums && oReports.aTopArtists && oReports.aTopTracks) {
        localStorage.setItem('oReports', JSON.stringify(oReports));
        $(window).attr('location', 'reports.html')
    }
}

function mergeItemsBy(sType) {
    var obj = {};
    var oTemp = {};
    var arr = [];

    if (sType === "album") {
        _oSort.id = "sortAlbum";
        _oSort.sortAscending = true;
        sortData();
        obj = doCollect("ALBUM TITLE");
        for (var key in obj) {
            oTemp = {
                album: key,
                artist: obj[key]["FEATURED ARTIST"],
                ACTUAL_TOTAL_PERFORMANCES: obj[key]["ACTUAL TOTAL PERFORMANCES"],
                PLAY_FREQUENCY: obj[key]["PLAY FREQUENCY"]
            }
            arr.push(oTemp);
        }
        return arr;
    }

    if (sType === "artist") {
        _oSort.id = "sortArtist";
        _oSort.sortAscending = true;
        sortData();
        obj = doCollect("FEATURED ARTIST");
        for (var key in obj) {
            oTemp = {
                artist: key,
                ACTUAL_TOTAL_PERFORMANCES: obj[key]["ACTUAL TOTAL PERFORMANCES"],
                PLAY_FREQUENCY: obj[key]["PLAY FREQUENCY"]
            }
            arr.push(oTemp);
        }
        return arr;
    }

    if (sType === "track") {
        _oSort.id = "sortSong";
        _oSort.sortAscending = true;
        sortData();
        obj = doCollect("SOUND RECORDING TITLE");
        for (var key in obj) {
            oTemp = {
                track: key,
                artist: obj[key]["FEATURED ARTIST"],
                ACTUAL_TOTAL_PERFORMANCES: obj[key]["ACTUAL TOTAL PERFORMANCES"],
                PLAY_FREQUENCY: obj[key]["PLAY FREQUENCY"]
            }
            arr.push(oTemp);
        }
        return arr;
    }
}

function doCollect(sFieldName) {
    var oCollect = {};
    var obj = null;
    for (var i = 0; i < _aData.length; i++) {
        obj = _aData[i];
        if (obj[sFieldName] !== "" && obj[sFieldName] !== " ") {
            if (!oCollect[obj[sFieldName]]) {
                oCollect[obj[sFieldName]] = {
                    "FEATURED ARTIST": obj["FEATURED ARTIST"],
                    "ACTUAL TOTAL PERFORMANCES": obj["ACTUAL TOTAL PERFORMANCES"],
                    "PLAY FREQUENCY": obj["PLAY FREQUENCY"]
                };
            } else {
                var oTemp = oCollect[obj[sFieldName]];
                oTemp["ACTUAL TOTAL PERFORMANCES"] = oTemp["ACTUAL TOTAL PERFORMANCES"] + obj["ACTUAL TOTAL PERFORMANCES"];
                oTemp["PLAY FREQUENCY"] = oTemp["PLAY FREQUENCY"] + obj["PLAY FREQUENCY"];
                //temp[obj[sFieldName]] = { "ACTUAL TOTAL PERFORMANCES": obj["ACTUAL TOTAL PERFORMANCES"], "PLAY FREQUENCY": obj["PLAY FREQUENCY"] };
            }
        }
    }

    return oCollect;
}

function sortThis(oColumn) {
    var oCurrentSortArrow = $('i', oColumn);

    // remove previous sort assigned column
    if (_oSort.id) {
        $("#" + _oSort.id).removeClass("zrq-sorted");
        $('i', "#" + _oSort.id).remove();
    }

    _oSort.id = oColumn.id;
    _oSort.sortAscending = true;
    $(oColumn).addClass("zrq-sorted");

    if (!oCurrentSortArrow) {
        $(oColumn).append("<i class='bi bi-arrow-up'></i>");
    } else {
        if (oCurrentSortArrow.hasClass("bi-arrow-up")) {
            $('i', oColumn).remove();
            _oSort.sortAscending = true;
            $(oColumn).append("<i class='bi bi-arrow-down'></i>");
        } else {
            $('i', oColumn).remove();
            _oSort.sortAscending = false;
            $(oColumn).append("<i class='bi bi-arrow-up'></i>");
        }
    }

    $("#myTable tbody").empty();
    sortData();
    buildTable(_aData, true);
}

function sortData() {

    var sColumn = "";
    var sortTypeIsString = false;

    switch (_oSort.id) {
        case "sortArtist":
            sColumn = "FEATURED ARTIST";
            sortTypeIsString = true;
            break;
        case "sortSong":
            sColumn = "SOUND RECORDING TITLE";
            sortTypeIsString = true;
            break;
        case "sortAlbum":
            sColumn = "ALBUM TITLE";
            sortTypeIsString = true;
            break;
        case "sortPerformance":
            sColumn = "ACTUAL TOTAL PERFORMANCES";
            sortTypeIsString = false;
            break;
        case "sortPlayFreq":
            sColumn = "PLAY FREQUENCY";
            sortTypeIsString = false;
            break;
    }

    if (_oSort.sortAscending) {
        if (sortTypeIsString) {
            _aData = _aData.sort((a, b) => {
                return b[sColumn].localeCompare(a[sColumn], 'en', { sensitivity: 'base' });
            });
        } else {
            _aData.sort((a, b) => (a[sColumn] < b[sColumn] ? 1 : -1))
        }
    } else {
        if (sortTypeIsString) {
            _aData = _aData.sort((a, b) => {
                return a[sColumn].localeCompare(b[sColumn], 'en', { sensitivity: 'base' });
            });
        } else {
            _aData.sort((a, b) => (a[sColumn] > b[sColumn] ? 1 : -1))
        }
    }


}

function buildTable(aFilteredItems, bJustRenderBody) {
    $.LoadingOverlay("show");
    var aItems = []
    if (aFilteredItems) {
        aItems = aFilteredItems;
    } else {
        aItems = _aData;
    }

    if (aItems) {
        try {
            var oTable;

            if (bJustRenderBody) {
                oTable = $("#zrqTbody");
            } else {
                oTable = $("#myTable");
                var str = "<table id='zrqTable' class='table table-striped'>";
                str += "<thead>";
                str += "<tr>";
                str += "<th id='sortArtist' onClick='sortThis(this)'scope='col'>Artist</th>";
                str += "<th id='sortSong' onClick='sortThis(this)' scope='col'>Song</th>";
                str += "<th id='sortAlbum' onClick='sortThis(this)' scope='col'>Album</th>";
                str += "<th id='sortPerformance' onClick='sortThis(this)' scope='col'>Perf.</th>";
                str += "<th id='sortPlayFreq' onClick='sortThis(this)' scope='col'>Play freq.</th>";
                str += "</tr>";
                str += "</thead>";
                str += "<tbody id='zrqTbody'>";
            }


            for (let i = 0; i < aItems.length; i++) {
                var obj = aItems[i];
                var arr = [];
                if (obj["FEATURED ARTIST"] === "" || obj["SOUND RECORDING TITLE"] === "") {
                    continue;
                }

                str += "<tr>";

                str += "<td>";
                str += obj["FEATURED ARTIST"];
                str += "</td>";

                str += "<td>";
                str += obj["SOUND RECORDING TITLE"];
                str += "</td>";

                str += "<td>";
                str += obj["ALBUM TITLE"];
                str += "</td>";

                str += "<td>";
                str += obj["ACTUAL TOTAL PERFORMANCES"];
                str += "</td>";

                str += "<td>";
                str += obj["PLAY FREQUENCY"];
                str += "</td>";

                str += "</tr>";
            }

            if (!bJustRenderBody) {
                str += "</tbody>";
                str += "</table>";
            }

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
    buildTable(null, false);
}

function onCloseModalClick() {
    var oPopup = $("#zrqError");
    var oPopup2 = $("#zrqMissingAlbumInfo");

    oPopup.hide();
    oPopup2.hide();
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
                buildTable(null, false);
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
                    if ($('#rbAll').is(':checked')) {
                        filterTable(sValue, null);
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
                    str = str ? str : "";
                    str = str.toString();
                    break;
                case "album":
                    str = n["ALBUM TITLE"];
                    str = str ? str : "";
                    str = str.toString();
                    break;
                default:  // search ALL columns
                    var str1 = n["FEATURED ARTIST"];
                    str1 = str1 ? str1 : "";
                    str1 = str1.toString();

                    var str2 = n["SOUND RECORDING TITLE"];
                    str2 = str2 ? str2 : "";
                    str2 = str2.toString();

                    var str3 = n["ALBUM TITLE"];
                    str3 = str3 ? str3 : "";
                    str3 = str3.toString();

                    str = str1 + " " + str2 + " " + str3;
                    break;
            }

            return str.search(rePattern) !== -1;
        });

    $("#myTable").html("");
    buildTable(arr, false);
}


