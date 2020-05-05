"use strict";
exports.__esModule = true;
(function () {
    var map = L.map("map-container")
        .setView([46.50053, -84.299119], 13);
    map.setMaxZoom(18);
    L.esri.basemapLayer("Topographic").addTo(map);
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
            alt: recArea.areaName,
            icon: L.icon.fontAwesome({
                iconClasses: "fas fa-tree",
                markerColor: "#00d1b2",
                markerFillOpacity: 1,
                markerStrokeWidth: 1,
                markerStrokeColor: "#ddd",
                iconColor: "#fff",
                iconXOffset: 1,
                iconYOffset: 0
            })
        }).addTo(map);
        var tagsHTML = "";
        for (var tagIndex = 0; tagIndex < recArea.tags.length; tagIndex += 1) {
            tagsHTML += "<span class=\"tag\">" + recArea.tags[tagIndex] + "</span>";
        }
        marker.bindPopup("<strong class=\"is-size-6\">" + recArea.areaName + "</strong><br />" +
            recArea.locationDescription +
            (recArea.tags.length > 0 ? "<hr /><div class=\"tags\">" + tagsHTML + "</div>" : ""));
        markers_searchResults.push(marker);
    }
    function setMapBoundsFn() {
        var latLngBounds;
        for (var _i = 0, markers_searchResults_2 = markers_searchResults; _i < markers_searchResults_2.length; _i++) {
            var marker = markers_searchResults_2[_i];
            if (latLngBounds) {
                latLngBounds.extend(marker.getLatLng());
            }
            else {
                latLngBounds = marker.getLatLng().toBounds(1);
            }
        }
        if (marker_currentLocation) {
            if (latLngBounds) {
                latLngBounds.extend(marker_currentLocation.getLatLng());
            }
            else {
                latLngBounds = marker_currentLocation.getLatLng().toBounds(1);
            }
        }
        map.setMaxZoom(16);
        map.fitBounds(latLngBounds.pad(0.1));
        map.setMaxZoom(18);
    }
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
        clickEvent.currentTarget.classList.toggle("is-active");
        document.getElementById("is-navbar-toggle-section").classList.toggle("is-active");
    });
    var searchStringEle = document.getElementById("is-search-string");
    function searchRecAreasFn(formEvent) {
        if (formEvent) {
            formEvent.stopPropagation();
            formEvent.preventDefault();
        }
        clearSearchMarkersFn();
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
        }
        if (markers_searchResults.length === 0) {
            document.getElementById("is-no-search-results-modal").classList.add("is-active");
        }
        else {
            setMapBoundsFn();
        }
    }
    var searchFormEle = document.getElementById("is-search-string-form");
    searchFormEle.addEventListener("submit", searchRecAreasFn);
    searchFormEle.addEventListener("reset", function (formEvent) {
        formEvent.preventDefault();
        searchStringEle.value = "";
        searchRecAreasFn(null);
    });
    searchRecAreasFn(null);
    if (navigator && navigator.geolocation) {
        document.getElementById("is-current-location-button").addEventListener("click", function (clickEvent) {
            clickEvent.preventDefault();
            if (marker_currentLocation) {
                marker_currentLocation.remove();
                marker_currentLocation = null;
                return;
            }
            var successFn = function (position) {
                marker_currentLocation = L.marker([position.coords.latitude, position.coords.longitude], {
                    alt: "Current Location",
                    icon: L.icon.fontAwesome({
                        iconClasses: "fas fa-smile",
                        markerColor: "#209cee",
                        markerFillOpacity: 1,
                        markerStrokeWidth: 1,
                        markerStrokeColor: "#ddd",
                        iconColor: "#fff",
                        iconXOffset: -1,
                        iconYOffset: 0
                    })
                }).addTo(map);
                marker_currentLocation.bindPopup("<strong>Current Location</strong>");
                setMapBoundsFn();
            };
            var errorFn = function (positionError) {
                alert(positionError.message);
            };
            navigator.geolocation.getCurrentPosition(successFn, errorFn);
        });
    }
    else {
        document.getElementById("is-current-location-button").remove();
    }
    function closeModalFn(clickEvent) {
        clickEvent.preventDefault();
        clickEvent.currentTarget.closest(".modal").classList.remove("is-active");
    }
    var modalCloseButtonEles = document.getElementsByClassName("is-modal-close-button");
    for (var buttonIndex = 0; buttonIndex < modalCloseButtonEles.length; buttonIndex += 1) {
        modalCloseButtonEles[buttonIndex].addEventListener("click", closeModalFn);
    }
    document.getElementById("is-about-toggle-button").addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault();
        document.getElementById("is-about-modal").classList.add("is-active");
    });
    var tagCloud = {};
    function showRecAreasByTagFn(clickEvent) {
        clickEvent.preventDefault();
        document.getElementById("is-tag-browser-modal").classList.remove("is-active");
        var tag = clickEvent.currentTarget.getAttribute("data-tag");
        searchStringEle.value = tag;
        clearSearchMarkersFn();
        var taggedRecAreas = tagCloud[tag];
        for (var _i = 0, taggedRecAreas_1 = taggedRecAreas; _i < taggedRecAreas_1.length; _i++) {
            var recArea = taggedRecAreas_1[_i];
            createAndAddSearchMarkerFn(recArea);
        }
        setMapBoundsFn();
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
