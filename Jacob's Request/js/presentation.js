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
var filterFields = ['GlobalID'];//fields to not display to the user
function receiveData(dataArray) {
    if (!dataArray) {
        return;
    }
    clearFilterSelect();
    //clearDataTable();
    //addTableHeader(); 
    var formattedForGoogle = [];
    for (var i = 0; i < dataArray.length; i++) {
        
        var name = dataArray[i][0];
        var value = dataArray[i][1];

        if (!ignoreValue(name)) {
            if ($.isNumeric(value)) {
                newFilterOptions(name, value);
            }
            formattedForGoogle.push([name, String(value)]);
        }//end ignore
    }
    drawTable(formattedForGoogle);
}
/*
 * returns true if name is present in ignoreFields array
 * returns false if it is not
 */
function ignoreValue(name) {
    for (var j = 0; j < filterFields.length; j++) {
        if (name == filterFields[j]) {
            return true;
        }
    }
    return false;
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
    $("#controlLooper").hide();
    clearAttachments();
    for (var i = 0; i < urls.length; i++) {
        makeAttachment(urls[i]);
    }
    $('.looper').loop;
    $('.looper').looper('next');
    $("#controlLooper").show();
}
/*
 * makes image tage and returns it
 */
function makeAttachment(url) {
    var tag = $("<div class='item'> <img src='" + url + "' > </div>");
    $("#putImagesHere").append(tag);
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
    $("#putImagesHere").empty();
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