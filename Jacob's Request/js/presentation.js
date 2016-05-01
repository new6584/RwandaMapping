/*
    at the moment:
        functionality:
            interact with the dom, any functions
            that do so go here
    
    to aurko: is that what functions.js is supposed to be doing? 
*/


/*
 * expects parellel array of names and values 
 * wrapper for when new data is being sent to the UI
 */
function receiveData(name, value) {
    var filterByOptions = [];
    addDataElement(name, value);
    if($.isNumeric(value)){
        newFilterOptions(name);
    }  
}
/*
 * adds a single name value pair to the data table
 * TODO
 */
function addDataElement(name,value) {
    var format = $("<p>" + name + "</p>" + "<p>" + value + "</p>");
    $("#singleOutput").append(format);
}
/*
 * replaces filter by selector with options
 * TODO
 */
function newFilterOptions(options) {
    $("#filterSelect").append(makeOption(options,options));
}
function makeOption(name, value) {
    return $("<option value=" + value + ">" + name + "</option>");
}

/*
 * wrapper for when new image urls are being sent to the UI 
 */
function receiveAttachment(urls) {
    //remove old elements
    for (var i = 0; i < urls.length; i++) {
        //make img tags + urls, add to carosel 
    }
}
/*
 * adds layer to primary layer select
 */
function newLayerOption(value, displayName) {
    $("#layerSelect").append(makeOption(displayName,value));
}


function clearDataTable() {
    $("#singleOutput").empty();
}
function clearLayerSelect() {
    $("#layerSelect").empty();
}
function clearFilterSelect() {
    $("#filterSelect").empty();
}