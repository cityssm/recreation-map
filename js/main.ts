import { RecreationData, TagData } from "./mapData";

declare const exports: any;


(function() {

  /*
   * Load Map
   */

  let marker_currentLocation: L.Marker;
  let markers_searchResults: L.Marker[] = [];

  const map = L.map("map-container")
    .setView([46.50053, -84.299119], 13);

  L.esri.basemapLayer("Topographic").addTo(map);


  /*
   * Capture Data
   */

  const recMapData: RecreationData = exports.recMapData;
  delete exports.recMapData;

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
    formEvent.stopPropagation();
    formEvent.preventDefault();

    alert("search");

    // clear existing map markers

    for (const marker of markers_searchResults) {
      marker.remove();
    }

    markers_searchResults = [];

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

        for (const areaTag of recArea.tags) {

          const tagData: TagData = tagMap[areaTag];

          const tagSearchTerms = tagData.tag +
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

      // save and display marker
    }
  }

  document.getElementById("is-search-string-form").addEventListener("submit", searchRecAreasFn);

}());
