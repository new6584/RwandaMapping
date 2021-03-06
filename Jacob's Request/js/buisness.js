/*
propose name change: EVENTHANDLERS

functionality:
    anything that handles events or statechange
    so functions for onclicks
    and emitted events go here

    at the moment it also makes the map, should maybe decouple that?
*/
// Kigeme Publishable 3 -- 152c333e3fbe4b3999e6d2c1c4faca3c
var esriMapId = "ff0e45c7f7cc45f6a796bdee1d4c9eb9"; // fake data set
var esriTileURI = "https://tiles.arcgis.com/tiles/RQcpPaCpMAXzUI5g/arcgis/rest/services/Kigeme_Tiles_For_Web/MapServer";
var domMapID = "map";

var getMe;
var dataTables = [];
var selectedPoint = null;
require([
    "myModules/DataRequests",
    "dojo/on",
    "dojo/domReady!"
], function (
    GetMe,
    on
    ) {
    //make map, initialize map functionality
    getMe = new GetMe(esriMapId, esriTileURI, domMapID);
    //possible events to listen for
    getMe.on('isReady', function () { initializePage(); }); //init.js
    getMe.on('dataRetrieval', function (data) { updateDataSet(data); });
    getMe.on('newAttachments', function (urls) { updateAttachments(urls); });
    getMe.on('dataError', function (error) { console.log(error); });
    getMe.on('dataFail', function (error) { console.log(error); });//probably dont care when this is called, nonfatal errors like misclicking where there is no data
    
});//end require

/*
 * newData is expected to be json with elements: .features and .fields
 * replaces codded values with their value and sends to UI methods
 * if multiple points clicked, only the topmost point will be used ( at index 0 )
 */
function updateDataSet(newData) {
    var fieldNames = [];
    for (var i = 0; i < newData.fields.length; i++) {
        var current = newData.fields[i];
        var currentFeature = newData.features[0].attributes;
        if (current.domain) {
            //replace in all
            var codeValue = currentFeature[current.name];
            if (codeValue) {
                var toReplace = current.domain.codedValues[codeValue - 1].name;
                currentFeature[current.name] = toReplace;
            }

        }//domain check
        fieldNames.push([current.name, currentFeature[current.name]]);
    }
    //send to UI
    receiveData(fieldNames);
    //save property
    selectedPoint = fieldNames;
}
/*
    sends href of images to UI
    calls whatever functions we'd need for that
*/
function updateAttachments(urls) {//this gets an array of image srcs
    receiveAttachment(urls);
}
/*
    gets checks and sends layer names to ui
*/
function updateLayers() {
    var regex = "_";
    var names = getMe.theLayerNames();
    if (!names) {
        return;
    }
    clearLayerSelect();
    var layerOptions = [];
    for (var i = 0; i < names.length; i++) {
        var value = names[i];
        var displayName = names[i].replace(regex, ' ');
        displayName = displayName.toUpperCase();
        layerOptions.push([displayName,value]);
    }
    receiveLayerOptions(layerOptions);
    //if legend add here
}

function layerChange() {
    //validate selection
    var selected = getSelectedPrimaryLayer();
    if (!selected || selected == getMe.primaryLayer) {
        return;
    }
    //setup new focus layer
    clearDataFields();
    if (!getMe.setPrimaryLayer(selected)) {
        alert('Selected Layer Does Not Exist');
    }
}

function filterChange() {
    var choice = getSelectedFilter();
    var layerTotal = getMe.getTotal(getMe.primaryLayer, choice);
    var pointData = getPointData(choice);
    if (!pointData) {
        console.log('filter change no att of name: ' + choice);
        return;
    }
    var graphData = [['Total','Selected'],['Total', layerTotal], ['Selected', pointData]];
    drawChart(graphData, choice);
}

function getPointData(field) {
    for (var i = 0; i < selectedPoint.length; i++) {
        var current = selectedPoint[i][0]
        if(current == field){
            return parseFloat(selectedPoint[i][1]);
        }
    }
    return null;
}