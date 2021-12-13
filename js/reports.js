_oReports = JSON.parse(localStorage.getItem('oReports'));

$(function () {
    renderTheReports();

    $('.goBack').on('click', function (e) {
        e.preventDefault();
        $(window).attr('location', 'index.html')
    })
});

function renderTheReports() {
    if (_oReports && _oReports.weHaveReportsToShow) {

        if (_oReports.TopAlbumsBySpins) {
            renderReport("#TopAlbumsBySpins", "spins", "album", _oReports.aTopBySpins)
        }

        if (_oReports.TopArtistsBySpins) {
            renderReport("#TopArtistsBySpins", "spins", "artist", _oReports.aTopBySpins)
        }

        if (_oReports.TopTracksBySpins) {
            renderReport("#TopTracksBySpins", "spins", "track", _oReports.aTopBySpins)
        }

        if (_oReports.TopAlbumsByListeners) {
            renderReport("#TopAlbumsByListeners", "listeners", "album", _oReports.aTopByListeners)
        }

        if (_oReports.TopArtistsByListeners) {
            renderReport("#TopArtistsByListeners", "listeners", "artist", _oReports.aTopByListeners)
        }

        if (_oReports.TopTracksByListeners) {
            renderReport("#TopTracksByListeners", "listeners", "track", _oReports.aTopByListeners)
        }

    }
}

function renderReport(sDIVid, sType, sSubType, aData) {
    var oDiv = $(sDIVid);
    var str = createTitle(sType, sSubType);
    str += createTable(aData, sType, sSubType);
    oDiv.html(str);
}

function createTable(aData, sType, sSubType) {
    var str = "<table class='table table-dark table-striped'>";

    // THEAD ====================================
    str += "<thead>";
    str += "<tr>";
    str += "<th scope='col'>#</th>";

    if (sSubType === "album") {
        str += "<th scope='col'>Artist</th>";
        str += "<th scope='col'>Album</th>";
    }

    if (sSubType === "artist") {
        str += "<th scope='col'>Artist</th>";
        str += "<th scope='col'></th>";
    }

    if (sSubType === "track") {
        str += "<th scope='col'>Artist</th>";
        str += "<th scope='col'>Track</th>";
    }

    if (sType === "spins") {
        str += "<th scope='col'>Spins</th>";
    } else {
        str += "<th scope='col'>Listeners</th>";
    }

    str += "</tr>";
    str += "</thead>";

    // TBODY ====================================
    str += "<tbody>";

    for (let i = 0; i < aData.length; i++) {
        var obj = aData[i];
        var oTrackAlbum = extractTrackAlbum(obj["SOUND RECORDING TITLE"]);
        str += "<tr>";
        str += "<th scope='row'>" + (i + 1) + "</th>";
        if (sSubType === "album") {
            str += "<td>" + obj["FEATURED ARTIST"] + "</td>";
            str += "<td>" + oTrackAlbum.album + "</td>";
        }
        if (sSubType === "artist") {
            str += "<td>" + obj["FEATURED ARTIST"] + "</td>";
            str += "<td>" + "</td>";
        }
        if (sSubType === "track") {
            str += "<td>" + obj["FEATURED ARTIST"] + "</td>";
            str += "<td>" + oTrackAlbum.track + "</td>";
        }

        if (sType === "spins") {
            str += "<td>" + obj["PLAY FREQUENCY"] + "</td>";
        } else {
            str += "<td>" + obj["ACTUAL TOTAL PERFORMANCES"] + "</td>";
        }

        str += "</tr>";
    }

    str += "</tbody>";
    str += "</table>";

    return str;
}

function extractTrackAlbum(str) {
    if (!str) {
        str = "";
    }

    if (typeof str !== "string") {
        str = str.toString()
    }

    var obj = {
        track: "",
        album: ""
    };

    var arr = str.split("-");

    if (arr[0]) {
        obj.track = arr[0];
    }

    if (arr[1]) {
        obj.album = arr[1];
    }

    return obj;
}

function createTitle(sType, sSubType) {
    switch (sType) {
        case "spins":
            switch (sSubType) {
                case "album":
                    return "<h1>Top " + _oReports.iNumberOfItems + " albums by SPINS</h1>";
                    break;
                case "artist":
                    return "<h1>Top " + _oReports.iNumberOfItems + " artists by SPINS</h1>";
                    break;
                case "track":
                    return "<h1>Top " + _oReports.iNumberOfItems + " tracks by SPINS</h1>";
                    break;
            }
            break;
        case "listeners":
            switch (sSubType) {
                case "album":
                    return "<h1>Top " + _oReports.iNumberOfItems + " albums by LISTENERS</h1>";
                    break;
                case "artist":
                    return "<h1>Top " + _oReports.iNumberOfItems + " artists by LISTENERS</h1>";
                    break;
                case "track":
                    return "<h1>Top " + _oReports.iNumberOfItems + " tracks by LISTENERS</h1>";
                    break;
            }
            break;
    }
}
