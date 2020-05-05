import { RecreationData, RecreationArea, TagData } from "./mapData";

declare const exports: any;


(function() {

  /*
   * Load Map
   */

  const map = L.map("map-container")
    .setView([46.50053, -84.299119], 13);

  map.setMaxZoom(17);

  L.esri.basemapLayer("Topographic").addTo(map);


  /*
   * Shared Map Functions
   */

  let marker_currentLocation: L.Marker;
  let markers_searchResults: L.Marker[] = [];

  function clearSearchMarkersFn() {

    for (const marker of markers_searchResults) {
      marker.remove();
    }

    markers_searchResults = [];
  }

  function createAndAddSearchMarkerFn(recArea: RecreationArea) {

    const marker = L.marker(recArea.geocoordinates, {
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

    marker.bindPopup("<strong>" + recArea.areaName + "</strong><br />" +
      recArea.locationDescription);

    markers_searchResults.push(marker);

  }

  function setMapBoundsFn() {

    let latLngBounds: L.LatLngBounds;

    for (const marker of markers_searchResults) {

      if (latLngBounds) {
        latLngBounds.extend(marker.getLatLng());
      } else {
        latLngBounds = marker.getLatLng().toBounds(1);
      }
    }

    if (marker_currentLocation) {

      if (latLngBounds) {
        latLngBounds.extend(marker_currentLocation.getLatLng());
      } else {
        latLngBounds = marker_currentLocation.getLatLng().toBounds(1);
      }

    }

    map.setMaxZoom(16);
    map.fitBounds(latLngBounds.pad(0.1));
    map.setMaxZoom(18);

  }


  /*
   * Capture Data
   */

  const recMapData: RecreationData = exports.recMapData;
  delete exports.recMapData;

  // build tag map

  const tagMap = {};

  for (const tagData of recMapData.tags) {
    tagMap[tagData.tag] = tagData;
  }

  Object.freeze(tagMap);


  /*
   * Navbar setup
   */

  document.getElementById("is-navbar-toggle-button").addEventListener("click", function(clickEvent: MouseEvent) {
    clickEvent.preventDefault();
    (<HTMLAnchorElement>clickEvent.currentTarget).classList.toggle("is-active");
    document.getElementById("is-navbar-toggle-section").classList.toggle("is-active");
  });


  /*
   * Search Tools
   */

  let searchStringEle = <HTMLInputElement>document.getElementById("is-search-string");

  function searchRecAreasFn(formEvent: Event) {

    if (formEvent) {
      formEvent.stopPropagation();
      formEvent.preventDefault();
    }

    clearSearchMarkersFn();

    // search records

    const searchStringPieces = searchStringEle.value.toLowerCase().split(" ");

    for (const recArea of recMapData.recAreas) {

      let displayRecord = true;

      const areaSearchTerms = recArea.areaName.toLowerCase() +
        " " +
        (recArea.keywords || "");

      for (const searchStringPiece of searchStringPieces) {

        if (areaSearchTerms.indexOf(searchStringPiece) > -1) {
          continue;
        }

        if (recArea.tags.length === 0) {
          displayRecord = false;
          break;
        }

        displayRecord = false;

        for (const areaTag of recArea.tags) {

          const tagData: TagData = tagMap[areaTag];

          const tagSearchTerms = areaTag +
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

      // save and display marker

      createAndAddSearchMarkerFn(recArea);

    }

    if (markers_searchResults.length === 0) {

      document.getElementById("is-no-search-results-modal").classList.add("is-active");

    } else {

      setMapBoundsFn();
    }
  }

  document.getElementById("is-search-string-form").addEventListener("submit", searchRecAreasFn);

  document.getElementById("is-search-string-form").addEventListener("reset", function(formEvent) {
    formEvent.preventDefault();
    searchStringEle.value = "";
    searchRecAreasFn(null);
  });

  searchRecAreasFn(null);


  /*
   * Geolocation
   */

  if (navigator && navigator.geolocation) {

    document.getElementById("is-current-location-button").addEventListener("click", function(clickEvent) {

      clickEvent.preventDefault();

      if (marker_currentLocation) {
        marker_currentLocation.remove();
        marker_currentLocation = null;
        return;
      }

      const successFn = function(position: Position) {

        marker_currentLocation = L.marker([position.coords.latitude, position.coords.longitude], {
          alt: "Current Location",
          icon: L.icon.fontAwesome({
            iconClasses: "fas fa-smile", // you _could_ add other icon classes, not tested.
            // marker/background style
            markerColor: "#209cee",
            markerFillOpacity: 1,
            markerStrokeWidth: 1,
            markerStrokeColor: "#ddd",
            // icon style
            iconColor: "#fff",
            iconXOffset: -1,
            iconYOffset: 0
          })

        }).addTo(map);

        marker_currentLocation.bindPopup("<strong>Current Location</strong>");

        setMapBoundsFn();

      };

      const errorFn = function(positionError: PositionError) {

        alert(positionError.message);
      };

      navigator.geolocation.getCurrentPosition(successFn, errorFn);

    });

  } else {
    document.getElementById("is-current-location-button").remove();
  }


  /*
   * Modals
   */

  function closeModalFn(clickEvent: Event) {

    clickEvent.preventDefault();
    (<HTMLButtonElement>clickEvent.currentTarget).closest(".modal").classList.remove("is-active");
  }

  const modalCloseButtonEles = document.getElementsByClassName("modal-close");

  for (let buttonIndex = 0; buttonIndex < modalCloseButtonEles.length; buttonIndex += 1) {
    modalCloseButtonEles[buttonIndex].addEventListener("click", closeModalFn);
  }


  /*
   * Tag Cloud Modal
   */

  const tagCloud = {};

  function showRecAreasByTagFn(clickEvent: Event) {

    clickEvent.preventDefault();

    document.getElementById("is-tag-browser-modal").classList.remove("is-active");

    const tag = (<HTMLAnchorElement>clickEvent.currentTarget).getAttribute("data-tag");

    searchStringEle.value = tag;
    clearSearchMarkersFn();

    const taggedRecAreas = tagCloud[tag];

    for (const recArea of taggedRecAreas) {

      createAndAddSearchMarkerFn(recArea);

    }

    setMapBoundsFn();

  }

  {

    let maxTagUsage = 0;

    for (const recArea of recMapData.recAreas) {

      for (const tag of recArea.tags) {

        if (tagCloud[tag]) {

          tagCloud[tag].push(recArea);

        } else {
          tagCloud[tag] = [recArea];
        }

        maxTagUsage = Math.max(maxTagUsage, tagCloud[tag].length);
      }
    }

    const tagCloudKeys = Object.keys(tagCloud).sort();

    const tagCloudContainerEle = document.getElementById("is-tag-cloud-container");
    tagCloudContainerEle.innerHTML = "";

    for (const tag of tagCloudKeys) {

      const tagEle = document.createElement("a");

      tagEle.className = "tag";

      if (tagCloud[tag].length >= 8) {
        tagEle.classList.add("is-large");
      } else if (tagCloud[tag].length >= 3) {
        tagEle.classList.add("is-medium");
      }

      tagEle.setAttribute("data-tag", tag);
      tagEle.innerText = tag;

      tagEle.addEventListener("click", showRecAreasByTagFn);

      tagCloudContainerEle.appendChild(tagEle);
    }

  }

  document.getElementById("is-tag-browser-toggle-button").addEventListener("click", function(clickEvent) {
    clickEvent.preventDefault();
    document.getElementById("is-tag-browser-modal").classList.add("is-active");
  });


  /*
   * Debug
   */

  map.on('click', function(e: L.LeafletEvent) {
    console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
  });
}());
