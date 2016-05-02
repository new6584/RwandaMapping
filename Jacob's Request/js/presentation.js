/*
    at the moment:
        functionality:
            interact with the dom, any functions
            that do so or are a direct wrap go here
    
    to aurko: is that what functions.js is supposed to be doing? 
*/


/*
 * wrapper for when new data is being sent to the UI
 */
function receiveData(name, value) {
    addDataElement(name, value);
    if($.isNumeric(value)){
        newFilterOptions(name,value);
    }
}
/*
 * adds a single name value pair to the data table
 * TODO
 */
function addDataElement(name,value) {
    var format = $("<tr><td>" + name + "</td>" + "<td>" + value + "</td></tr>");
    $("#dataTable").append(format);
}
/*
 * replaces filter by selector with options
 * TODO
 */
function newFilterOptions(name,value) {
    $("#filterSelect").append(makeOption(name, value));
}
/*
 * makes an option tag and returns it
 */
function makeOption(name, value) {
    return $("<option value=" + value + ">" + name + "</option>");
}

/*
 * wrapper for when new image urls are being sent to the UI 
 */
function receiveAttachment(url) {
    $("attachment").append(makeAttachment(url));
}
/*
 * makes image tage and returns it
 */
function makeAttachment(url) {
    return $("<img src='"+url+"' >");
}
/*
 * adds layer to primary layer select
 */
function newLayerOption(value, displayName) {
    $("#layerSelect").append(makeOption(displayName,value));
}
/*
 * returns currently selected primary layer
 */
function getSelectedPrimaryLayer() {
    return $("#layerSelect").val();
}



function clearAttachments() {
    $("#attachment").empty();
}
function clearDataTable() {
    $("#dataTable").empty();
}
function clearLayerSelect() {
    $("#layerSelect").empty();
}
function clearFilterSelect() {
    $("#filterSelect").empty();
}
function clearDataFields() {
    clearFilterSelect();
    newFilterOptions("Select A Filter");// a default filter 
}