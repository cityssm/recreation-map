import { RecreationData, TagData } from "./mapData";

declare const exports: any;


(function() {

  /*
   * Load Map
   */

  let marker_currentLocation: L.Marker;
  let markers_searchResults: L.Marker[] = [];

  function clearSearchMarkersFn() {

    for (const marker of markers_searchResults) {
      marker.remove();
    }

    markers_searchResults = [];
  }

  function createAndAddSearchMarkerFn(recArea) {

    const marker = L.marker(recArea.geocoordinates, {
      alt: recArea.areaName
    }).addTo(map);

    marker.bindPopup("<strong>" + recArea.areaName + "</strong><br />" +
      recArea.locationDescription);

    markers_searchResults.push(marker);

  }

  const map = L.map("map-container")
    .setView([46.50053, -84.299119], 13);

  L.esri.basemapLayer("Topographic").addTo(map);


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

  document.getElementById("is-navbar-toggle-button").addEventListener("click", function(clickEvent) {
    clickEvent.preventDefault();
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

    let latLngBounds: L.LatLngBounds;

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

      if (markers_searchResults.length === 1) {
        latLngBounds = L.latLngBounds([recArea.geocoordinates]);
      } else {
        latLngBounds.extend(recArea.geocoordinates);
      }

    }

    if (markers_searchResults.length === 0) {

      document.getElementById("is-no-search-results-modal").classList.add("is-active");

    } else {

      map.fitBounds(latLngBounds.pad(0.05));
    }
  }

  document.getElementById("is-search-string-form").addEventListener("submit", searchRecAreasFn);

  searchRecAreasFn(null);


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

  function showRecAreasByTagFn(clickEvent : Event) {

    clickEvent.preventDefault();

    document.getElementById("is-tag-browser-modal").classList.remove("is-active");

    const tag = clickEvent.currentTarget.getAttribute("data-tag");

    searchStringEle.value = tag;
    clearSearchMarkersFn();

    let latLngBounds: L.LatLngBounds;

    const taggedRecAreas = tagCloud[tag];

    for (const recArea of taggedRecAreas) {

      createAndAddSearchMarkerFn(recArea);

      if (markers_searchResults.length === 1) {
        latLngBounds = L.latLngBounds([recArea.geocoordinates]);
      } else {
        latLngBounds.extend(recArea.geocoordinates);
      }
    }

    map.fitBounds(latLngBounds.pad(0.05));

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
