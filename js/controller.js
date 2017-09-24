/**
 * This file controls the activity on the Earthquakes page.
 * It requires the EarthQuakesService and GoogleMap classes.
 * The web service and Google Map concerns are separated, and this script brings the data and views together.
 *
 * @author Michael Kowalenko <michael.kowalenko2@gmail.com>
 */

/**
 * Earthquakes API configuration
 * @type object
 */
const API_EARTHQUAKES_CONFIG = {
    FEED: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
};

/**
 * Service to get Earthquake data
 * @type EarthQuakesService
 */
const service = new EarthQuakesService(API_EARTHQUAKES_CONFIG);

/**
 * Array holding list of Earthquakes, once retrieved from the web service.
 * @type array
 */
var earthquakesList = [];

/**
 * Callback function for the Google Maps API - responsible for initialisting the GoogleMap and calling the web service.
 */
function initGoogleMap() {

    service.getEarthquakesPastDay(function(earthquakes) {
        var googleMap = new GoogleMap('earthquakeMap');
        earthquakes.forEach(function(earthquake, index) {
            var lat = earthquake.geometry.coordinates[0];
            var lng = earthquake.geometry.coordinates[1];
            var locationName = earthquake.properties.place;
            var date = new Date(earthquake.properties.time).toString();
            var marker = googleMap.addMarker(lat, lng, earthquake, markerClicked);
            googleMap.addCalloutToMarker(marker, index, locationName, date, markerCalloutClicked);
        });
        earthquakesList = earthquakes; // Makes the list of earthquakes reusable
    });
};

/**
 * Callback function - when a marker is clicked on the Google Map
 * @param object earthquakeData
 */
function markerClicked(earthquakeData) {
    // Handled elsewhere (a callout is opened).
    // Placeholder, for future functionality.
}

/**
 * Callback function - when a callout from a marker is clicked on the Google Map
 * @param object earthquakeData
 */
function markerCalloutClicked(earthquakesListIndex) {
    setActiveEarthquake(earthquakesList[earthquakesListIndex]);
}

/**
 * Function to control the data in the "More Information" section
 * @param object earthquakeData (in the format from the Earthquake service)
 */
function setActiveEarthquake(earthquakeData) {
    var detailsContainer = document.getElementById('earthquakeLocationDetails');
    if (!earthquakeData) {
        detailsContainer.innerHTML = 'Please click on an Earthquake\'s marker and callout';
        return;
    }
    var prop = earthquakeData.properties;
    var detailsHTML = '<ul>' +
        '   <li><span class="label">Location:</span> ' + prop.place + '</li>' +
        '   <li><span class="label">Event ID:</span> ' + earthquakeData.id + '</li>' +
        '   <li><span class="label">Magnitude:</span> ' + prop.mag + '</li>' +
        '   <li><span class="label">Felt:</span> ' + prop.felt + '</li>' +
        '   <li><span class="label">Gap:</span> ' + prop.gap + '</li>' +
        '   <li><span class="label">Time:</span> ' + new Date(prop.time).toString() + '</li>' +
        '   <li><span class="label">Last Updated:</span> ' + new Date(prop.updated).toString() + '</li>' +
        '   <li><span class="label">Tsunami?:</span> ' + (prop.tsunami ? 'Yes' : 'No') + '</li>' +
        '   <li><span class="label">More Details:</span> <a href="' + prop.url + '" target="_blank">Click here</a></li>' +
        '</ul>';
    detailsContainer.innerHTML = detailsHTML;
}