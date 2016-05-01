/*
propose name change: EVENTHANDLERS

functionality:
    anything that handles events or statechange
    so functions for onclicks
    and emitted events go here

    at the moment it also makes the map, should maybe decouple that?
*/

var esriMapId = "152c333e3fbe4b3999e6d2c1c4faca3c";
var esriTileURI = "https://tiles.arcgis.com/tiles/RQcpPaCpMAXzUI5g/arcgis/rest/services/Kigeme_Tiles_For_Web/MapServer";
var domMapID = "map";

var getMe;

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
    getMe.on('isReady', function () { startApp(); });
    getMe.on('dataRetrieval', function (data) { updateDataSet(data); });
    getMe.on('newAttachments', function (urls) { updateAttachments(urls); });
    getMe.on('dataError', function (error) { console.log(error); });
    getMe.on('dataFail', function (error) { console.log(error); });//probably dont care when this is called, nonfatal errors like misclicking where there is no data


    function startApp() {
        //first calls, default dataset? 
    }
    /*
     * newData is expected to be json with elements: .features and .fields
     * replaces codded values with their value and sends to UI methods
     * if multiple points clicked, only the topmost point will be used ( at index 0 )
     */
    function updateDataSet(newData) {
        clearDataTable();
        var fieldNames = [];
        for (var i = 0; i < newData.fields.length; i++) {
            var current = newData.fields[i];
            if (current.domain) {
                //replace in all
                var currentFeature = newData.features[0].attributes;
                var codeValue = currentFeature[current.name];
                if (codeValue) {
                    var toReplace = current.domain.codedValues[codeValue - 1].name;
                    currentFeature[current.name] = toReplace;
                }
                    
            }//domain check
            fieldNames.push(current.name);            
        }
        //send to UI
        var current = newData.features[0].attributes;
        receiveData(fieldNames, current[fieldNames]);


        /*for (var namesIndex = 0; namesIndex < fieldNames.length; namesIndex++) {
            receiveData(fieldNames[namesIndex], current[fieldNames[namesIndex]]);
        }*/
    }
    /*
        sends href of images to UI
        calls whatever functions we'd need for that
    */
    function updateAttachments(urls) {//this gets an array of image srcs
        for (var i = 0; i < urls.length; i++) {
            //send urlHREF to ui function ( urls[i] ); TODO
        }
    }
    /*
        gets checks and sends layer names to ui
    */
    function pullLayerNames() {
        var regex = "/\_|\\/g";//remove _ and \
        var names = getMe.theLayerNames();
        //clear legend?
        for (var i = 0; i < names.length; i++) {
            //order here is important 
            //send to update layer options method (names[i], names[i].replace(regex, ' ') );
        }

    }

});//end require