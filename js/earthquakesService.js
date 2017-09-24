/**
 * Earthquake.usgs.gov webservice file.
 * This file defines a class (EarthQuakesService) that can be used by other parts of the application
 * to call the earthquake.usgs.gov API.
 *
 * @author Michael Kowalenko <michael.kowalenko2@gmail.com>
 */

/**
 * Reusable wrapper for the Earthquakes service
 * @constructor
 * @param object apiDetails
 */
const EarthQuakesService = function(apiDetails) {

    /**
     * Get the ist of earthquakes in the last 24 hours
     * @param function callback
     * @return call to callback with array earthquakes (or empty array on error)
     */
    this.getEarthquakesPastDay = function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiDetails.FEED);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            var earthquakes = []; // Default empty array if the request/formatting fails
            if (xhr.status == 200) {
                try {
                    var parsedResponse = JSON.parse(xhr.responseText);
                    earthquakes = parsedResponse.features;
                } catch (e) {
                    console.error('An error occurred handling the API response - invalid JSON format.');
                }
            } else {
                console.error('API request failed.');
            }
            return callback(earthquakes);
        };
        xhr.send();
    };
};