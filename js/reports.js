var _oReports;
$(function () {
    _oReports = JSON.parse(localStorage.getItem('oReports'));

    renderTheReports();

    $('.goBack').on('click', function (e) {
        e.preventDefault();
        $(window).attr('location', 'index.html')
    })
});

function renderTheReports() {

    if (_oReports) {
        if (_oReports.aTopAlbums) {
            renderReport("#TopAlbumsBySpins", "spins", "album", _oReports.aTopAlbums)
            // renderReport("#TopAlbumsByListeners", "listeners", "album", _oReports.aTopAlbums)
        }

        if (_oReports.aTopArtists) {
            renderReport("#TopArtistsBySpins", "spins", "artist", _oReports.aTopArtists)
            // renderReport("#TopArtistsByListeners", "listeners", "artist", _oReports.aTopArtists)
        }

        if (_oReports.aTopTracks) {
            renderReport("#TopTracksBySpins", "spins", "track", _oReports.aTopTracks)
            // renderReport("#TopTracksByListeners", "listeners", "track", _oReports.aTopTracks)
        }
    }
}

function renderReport(sDIVid, sType, sSubType, aData) {
    var oDiv = $(sDIVid);

    switch (sType) {
        case "spins":
            sortDataBySpins(aData);
            break;
        case "listeners":
            sortDataByListeners(aData);
            break;
    }

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
        str += "<th scope='col'>Album</th>";
        str += "<th scope='col'>Artist</th>";
    }

    if (sSubType === "artist") {
        str += "<th scope='col'>Artist</th>";
        str += "<th scope='col'></th>";
    }

    if (sSubType === "track") {
        str += "<th scope='col'>Track</th>";
        str += "<th scope='col'>Artist</th>";
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

    for (let i = 0; i < _oReports.iNumberOfItems; i++) {
        var obj = aData[i];

        str += "<tr>";
        str += "<th scope='row'>" + (i + 1) + "</th>";
        if (sSubType === "album") {
            str += "<td>" + obj.Album + "</td>";
            str += "<td>" + obj.Artist + "</td>";
        }
        if (sSubType === "artist") {
            str += "<td>" + obj.Artist + "</td>";
            str += "<td>" + "</td>";
        }
        if (sSubType === "track") {
            str += "<td>" + obj.track + "</td>";
            str += "<td>" + obj.Artist + "</td>";
        }

        if (sType === "spins") {
            str += "<td>" + obj.Plays + "</td>";
        } else {
            str += "<td>" + obj.Year + "</td>";
        }

        str += "</tr>";
    }

    str += "</tbody>";
    str += "</table>";

    return str;
}

function sortDataBySpins(aData) {
    aData.sort((a, b) => (a.Plays < b.Plays ? 1 : -1))
}

function sortDataByListeners(aData) {
    aData.sort((a, b) => (a.Year < b.Year ? 1 : -1))
}


function createTitle(sType, sSubType) {
    switch (sType) {
        case "spins":
            switch (sSubType) {
                case "album":
                    return "<h1>Top " + _oReports.iNumberOfItems + " ALBUMS </h1>";
                    break;
                case "artist":
                    return "<h1>Top " + _oReports.iNumberOfItems + " ARTISTS </h1>";
                    break;
                case "track":
                    return "<h1>Top " + _oReports.iNumberOfItems + " TRACKS </h1>";
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
