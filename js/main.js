"use strict";
exports.__esModule = true;
(function () {
    var marker_currentLocation;
    var markers_searchResults = [];
    function clearSearchMarkersFn() {
        for (var _i = 0, markers_searchResults_1 = markers_searchResults; _i < markers_searchResults_1.length; _i++) {
            var marker = markers_searchResults_1[_i];
            marker.remove();
        }
        markers_searchResults = [];
    }
    function createAndAddSearchMarkerFn(recArea) {
        var marker = L.marker(recArea.geocoordinates, {
            alt: recArea.areaName
        }).addTo(map);
        marker.bindPopup("<strong>" + recArea.areaName + "</strong><br />" +
            recArea.locationDescription);
        markers_searchResults.push(marker);
    }
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
        if (formEvent) {
            formEvent.stopPropagation();
            formEvent.preventDefault();
        }
        clearSearchMarkersFn();
        var latLngBounds;
        var searchStringPieces = searchStringEle.value.toLowerCase().split(" ");
        for (var _i = 0, _a = recMapData.recAreas; _i < _a.length; _i++) {
            var recArea = _a[_i];
            var displayRecord = true;
            var areaSearchTerms = recArea.areaName.toLowerCase() +
                " " +
                (recArea.keywords || "");
            for (var _b = 0, searchStringPieces_1 = searchStringPieces; _b < searchStringPieces_1.length; _b++) {
                var searchStringPiece = searchStringPieces_1[_b];
                if (areaSearchTerms.indexOf(searchStringPiece) > -1) {
                    continue;
                }
                if (recArea.tags.length === 0) {
                    displayRecord = false;
                    break;
                }
                displayRecord = false;
                for (var _c = 0, _d = recArea.tags; _c < _d.length; _c++) {
                    var areaTag = _d[_c];
                    var tagData = tagMap[areaTag];
                    var tagSearchTerms = areaTag +
                        " " +
                        (tagData ? tagData.keywords || "" : "");
                    if (tagSearchTerms.indexOf(searchStringPiece) !== -1) {
                        displayRecord = true;
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
            createAndAddSearchMarkerFn(recArea);
            if (markers_searchResults.length === 1) {
                latLngBounds = L.latLngBounds([recArea.geocoordinates]);
            }
            else {
                latLngBounds.extend(recArea.geocoordinates);
            }
        }
        if (markers_searchResults.length === 0) {
            document.getElementById("is-no-search-results-modal").classList.add("is-active");
        }
        else {
            map.fitBounds(latLngBounds.pad(0.05));
        }
    }
    document.getElementById("is-search-string-form").addEventListener("submit", searchRecAreasFn);
    searchRecAreasFn(null);
    function closeModalFn(clickEvent) {
        clickEvent.preventDefault();
        clickEvent.currentTarget.closest(".modal").classList.remove("is-active");
    }
    var modalCloseButtonEles = document.getElementsByClassName("modal-close");
    for (var buttonIndex = 0; buttonIndex < modalCloseButtonEles.length; buttonIndex += 1) {
        modalCloseButtonEles[buttonIndex].addEventListener("click", closeModalFn);
    }
    var tagCloud = {};
    function showRecAreasByTagFn(clickEvent) {
        clickEvent.preventDefault();
        document.getElementById("is-tag-browser-modal").classList.remove("is-active");
        var tag = clickEvent.currentTarget.getAttribute("data-tag");
        searchStringEle.value = tag;
        clearSearchMarkersFn();
        var latLngBounds;
        var taggedRecAreas = tagCloud[tag];
        for (var _i = 0, taggedRecAreas_1 = taggedRecAreas; _i < taggedRecAreas_1.length; _i++) {
            var recArea = taggedRecAreas_1[_i];
            createAndAddSearchMarkerFn(recArea);
            if (markers_searchResults.length === 1) {
                latLngBounds = L.latLngBounds([recArea.geocoordinates]);
            }
            else {
                latLngBounds.extend(recArea.geocoordinates);
            }
        }
        map.fitBounds(latLngBounds.pad(0.05));
    }
    {
        var maxTagUsage = 0;
        for (var _b = 0, _c = recMapData.recAreas; _b < _c.length; _b++) {
            var recArea = _c[_b];
            for (var _d = 0, _e = recArea.tags; _d < _e.length; _d++) {
                var tag = _e[_d];
                if (tagCloud[tag]) {
                    tagCloud[tag].push(recArea);
                }
                else {
                    tagCloud[tag] = [recArea];
                }
                maxTagUsage = Math.max(maxTagUsage, tagCloud[tag].length);
            }
        }
        var tagCloudKeys = Object.keys(tagCloud).sort();
        var tagCloudContainerEle = document.getElementById("is-tag-cloud-container");
        tagCloudContainerEle.innerHTML = "";
        for (var _f = 0, tagCloudKeys_1 = tagCloudKeys; _f < tagCloudKeys_1.length; _f++) {
            var tag = tagCloudKeys_1[_f];
            var tagEle = document.createElement("a");
            tagEle.className = "tag";
            if (tagCloud[tag].length >= 8) {
                tagEle.classList.add("is-large");
            }
            else if (tagCloud[tag].length >= 3) {
                tagEle.classList.add("is-medium");
            }
            tagEle.setAttribute("data-tag", tag);
            tagEle.innerText = tag;
            tagEle.addEventListener("click", showRecAreasByTagFn);
            tagCloudContainerEle.appendChild(tagEle);
        }
    }
    document.getElementById("is-tag-browser-toggle-button").addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault();
        document.getElementById("is-tag-browser-modal").classList.add("is-active");
    });
    map.on('click', function (e) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
    });
}());
