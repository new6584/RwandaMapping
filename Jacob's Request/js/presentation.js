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
function receiveData(dataArray) {
    if (!dataArray) {
        return;
    }
    clearFilterSelect();
    clearDataTable();
    addTableHeader();    
    for (var i = 0; i < dataArray.length; i++) {
        var name = dataArray[i][0];
        var value = dataArray[i][1];
        addDataElement(name, value);
        if ($.isNumeric(value)) {
            newFilterOptions(name, value);
        }
    }
    
}
/*
 * adds a single name value pair to the data table
 */
function addDataElement(name,value) {
    var format = $("<tr><td>" + name + "</td>" + "<td>" + value + "</td></tr>");
    $("#dataTable").append(format);
}
function addTableHeader() {
    var header = $("<tr><th>Field Name</th><th>Value</th></tr>");
    $("#dataTable").append(header);
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
function receiveAttachment(urls) {
    clearAttachments();
    for (var i = 0; i < urls.length; i++) {
        makeAttachment(urls[i]);
    }    
}
/*
 * makes image tage and returns it
 */
function makeAttachment(url) {
    var tag = $("<img src='" + url + "' />");
    console.log(tag);
    $("#attachment").append(tag);
}
/*
 * gets layer options and unpacks them
 */
function receiveLayerOptions(layerOptions) {
    if (!layerOptions) {
        return;
    }
    for (var i = 0; i < layerOptions.length; i++) {
        var display = layerOptions[i][0];
        var value = layerOptions[i][1];
        newLayerOption(display, value);
    }
}
/*
 * adds layer to primary layer select
 */
function newLayerOption(displayName,value) {
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