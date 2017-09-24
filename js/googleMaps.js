/**
 * This file defines a class (GoogleMaps) that can wrap the Google Map.
 * The precondition is that the Google Maps library is already loaded, and these functions should be called
 * by the callback.
 *
 * @author Michael Kowalenko <michael.kowalenko2@gmail.com>
 */

/**
 * Wrapper for Google Maps objects
 * @param string containerID - ID of the HTML element to contain the Google Map
 * @requires google.maps scripts to be loaded
 * @constructor
 */
const GoogleMap = function(containerID) {

    /**
     * Random location for the initial map midpoint - in this case central Australia
     * @type object {{lat: number, lng: number}}
     */
    this.startingCenter = {
        lat: -25.363,
        lng: 131.044
    };

    /**
     * Create the actual map (this also draws it on the page)
     * @type {google.maps.Map}
     */
    this.map = new google.maps.Map(document.getElementById(containerID), {
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
        center: this.startingCenter
    });

    /**
     * Store a marker with the open callout - to ensure only one callout is open at a time
     * @type object|null
     */
    var openMarker = null;

    /**
     * Add a marker to the map, with an on-click callback function. It is not the
     * responsibility of this Google Map class to know how to handle the API response.
     * @param number latitude
     * @param number longitude
     * @param object data (raw API response, does not need to be understood by the GoogleMap)
     * @param function onClickCallback
     * @return object marker
     */
    this.addMarker = function(latitude, longitude, data, onClickCallback) {
        // Creating a new google.maps.Marker adds the marker to the map
        var marker = new google.maps.Marker({
            position: {
                lat: latitude,
                lng: longitude,
            },
            map: this.map
        });

        // Allow the controller to observe marker click events too
        marker.addListener('click', function() {
            onClickCallback(data);
        });

        return marker;
    };

    /**
     * Add a callout to the marker, which will be displayed on a click event.
     * @param object marker
     * @param int earthquakeIndex (position in the overall earthquakes array)
     * @param string locationName
     * @param object date
     * @param function calloutClickCallback (taking parameter: earthquakeIndex)
     * @return Object infowindow
     */
    this.addCalloutToMarker = function(marker, earthquakeIndex, locationName, date, calloutClickCallback) {
        // Inline call for the InfoWindow onclick event (Google InfoWindows do not contain a click listener)
        var iwClickCallback = calloutClickCallback.name + "(" + earthquakeIndex + ");"
        var infoWindowHTML =
            '<div class="earthquakeInfoCallout" onclick="' + iwClickCallback + '">' +
            '   <h3>' + locationName + '</h3>' +
            '   <p><strong>Time: </strong>' + date.toString() + '</p>' +
            '</div>';

        // Add human readable HTML content to a new InfoWindow
        var markerCallout = new google.maps.InfoWindow({
            content: infoWindowHTML
        });

        // Add the on click event listener to the marker
        marker.addListener('click', function() {
            markerCallout.open(this.map, marker);

            // Close any other open marker
            if (openMarker) {
                openMarker.close();
            }
            openMarker = markerCallout;
        });

        return markerCallout;
    };
};