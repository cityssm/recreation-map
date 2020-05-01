"use strict";
exports.__esModule = true;
(function () {
    var marker_currentLocation;
    var markers_searchResults = [];
    var map = L.map("map-container")
        .setView([46.50053, -84.299119], 13);
    L.esri.basemapLayer("Topographic").addTo(map);
    var recMapData = exports.recMapData;
    delete exports.recMapData;
    var tagMap = {};
    for (var _i = 0, _a = recMapData.tags; _i < _a.length; _i++) {
        var tagData = _a[_i];
        tagMap[tagData.tag] = tagData;
    }
    Object.freeze(tagMap);
    document.getElementById("is-navbar-toggle-button").addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault();
        document.getElementById("is-navbar-toggle-section").classList.toggle("is-active");
    });
    var searchStringEle = document.getElementById("is-search-string");
    function searchRecAreasFn(formEvent) {
        formEvent.stopPropagation();
        formEvent.preventDefault();
        alert("search");
        for (var _i = 0, markers_searchResults_1 = markers_searchResults; _i < markers_searchResults_1.length; _i++) {
            var marker = markers_searchResults_1[_i];
            marker.remove();
        }
        markers_searchResults = [];
        var searchStringPieces = searchStringEle.value.toLowerCase().split(" ");
        for (var _a = 0, _b = recMapData.recAreas; _a < _b.length; _a++) {
            var recArea = _b[_a];
            var displayRecord = true;
            var areaSearchTerms = recArea.areaName.toLowerCase() +
                " " +
                (recArea.keywords || "");
            for (var _c = 0, searchStringPieces_1 = searchStringPieces; _c < searchStringPieces_1.length; _c++) {
                var searchStringPiece = searchStringPieces_1[_c];
                if (areaSearchTerms.indexOf(searchStringPiece) > -1) {
                    continue;
                }
                for (var _d = 0, _e = recArea.tags; _d < _e.length; _d++) {
                    var areaTag = _e[_d];
                    var tagData = tagMap[areaTag];
                    var tagSearchTerms = tagData.tag +
                        " " +
                        (tagData.keywords || "");
                    if (tagSearchTerms.indexOf(searchStringPiece) === -1) {
                        displayRecord;
                        break;
                    }
                }
                if (!displayRecord) {
                    break;
                }
            }
            if (!displayRecord) {
                continue;
            }
        }
    }
    document.getElementById("is-search-string-form").addEventListener("submit", searchRecAreasFn);
}());
