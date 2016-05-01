/*
    Womble presents: map stuff
    this file creates a data module for an
    esri map application.

    We use ESRI's API which can be found here: https://developers.arcgis.com/javascript/
    Should read up on Dojo as well specifically their declare statement (class creator):  http://dojotoolkit.org/documentation/tutorials/1.10/modules/index.html
    I'm writing this as much to remind me to do it, but there is a... DESIGN DOC somehwere, unless we never actually do that...
    Again, so I remember, hopefully, the first time a process is introduced ill try and comment in why / what its doing
    especially in a place where you would need to change something if you are making your own application for BT,
    which shouldn't be happening in this file besides changing URIs, unless there is a query you want to add i guess
    
    ****************************************
    ****************************************
    *    LAYER NAMES NEED TO BE UNIQUE     *
    ****************************************
    ****************************************
    assumes atleast one layer 

    expected callback name is: GetMe
    -----------------events-------------------------
       dataFail : non destructive error
       dataError : destructive error
       isReady : map has loaded 
       dataRetrieval : query success
       newAttachments: attachments found for point
    ------------------------------------------------

    initializes the map object and provides tools to interact with the map
*/




define([//think of this as a java import statment
    "dojo/_base/declare",
    "dojo/Evented",
    "esri/map",
    "esri/arcgis/utils",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"//no callback 
],
function (//callbacks for those 'import statments' above
    declare,
    Evented,
    Map,
    esriUtils,
    QueryTask,
    Query,
    Point,
    FeatureLayer

) {
    return declare([Evented], {//make a class that 'extends' evented

        mapID: null,
        restService: null,//location of complete map
        myMap: null,//variable for the map object
        layerNameAndID: null,//stores layer identifying information
        restURI: null,//location of map content
        primaryLayer: null,//name of layer 

        constructor: function (_mapID,_tileURI,mapDiv) {
            this.mapID = _mapID;
            this.restService = "http://www.arcgis.com/sharing/rest/content/items";//dont change this unless your hosting the fileGeo on not ESRI servers
            //CHANGE this to reflect your map's REST service. this can be found under 'myContent' -> desired map on arcgis.com
            //be sure it looks exactly like this one: {server}.arcgis.com/ identifier / arcgis / rest / services / {YOUR MAP} / FeatureServer /
            this.restURI = "https://services2.arcgis.com/RQcpPaCpMAXzUI5g/arcgis/rest/services/Kigeme/FeatureServer/";
            this.aNewMap(mapDiv, _tileURI);
            layerNameAndID = [];
        },
        /*
         * creates map based on constructors parameters
         * adds properties and tiles
         * check for isReady to know when we're done and this 'class'
         * is ready to be used
         */
        aNewMap: function (mapDiv,myTiles) {
            var self = this;//scoping
            esriUtils.arcgisUrl = this.restService;
            esriUtils.createMap(this.mapID, mapDiv,
                {//map options go here
                    isDoubleClickZoom: false
                }
                ).then(function (response) {
                    self.myMap = response.map;
                    self.myMap.addLayer(new esri.layers.ArcGISTiledMapServiceLayer(myTiles));
                    // sets a default primary layer, important that happens before letting user click or hiding layers
                    self.psetLayerNameToID();
                    //when the mapDiv is clicked, users can now interact through clicks
                    self.myMap.on('click', function (evt) {
                        self.pclickHandler(evt);
                });
                
                //send event isReady with no callback
                self.emit("isReady", {});
            });
        },
        /*
         * pulls the layer names from the map
         * returns them as an array of strings
         */
        theLayerNames: function () {
            var layerNames = [];
            for (var i = 0; i < this.layerNameAndID.length; i++) {
                layerNames.push(this.layerNameAndID[i].name);
            }
            return layerNames;
        },
        /* 
         * creates a sql query for psendQuery
         * getWhat: array of desired fields ex: ['x','y','z'] 
         * whereClause: sql where clause 
         * queries only primary layer
         * psendQuery emits dataRetreival event on success, no return
         * EG: select getWhat from this.primaryLayer where whereClause;
         */
        layerData: function (getWhat, whereClause) {
            var query = new Query();
            query.outFields = getWhat;
            query.where = whereClause;
            this.psendQuery(query);
        },
		/*
			get rest service's image source
			returns an array of all image sources
			attached to passed object data
            emits newAttachments, with an array of all attachments found
            [] if no new attachments
		*/
        theAttachments(objectID) {//{LAYER ID}/{OBJECTID}/attachments/{attachment id}/{ json callback Identifier }
			var root = this.restURI + this.pnameToIndex(this.primaryLayer) + "/" + objectID + "/attachments/"
			var imageJson = root + "?f=pjson&token="; //query this for attachmentInfos[i].id
			var self = this;
			$.getJSON(imageJson).done(function (response) {
			    var imgSrcs = [];
			    for (var i = 0; i < response.attachmentInfos.length ; i++) {
			        imgSrcs.push( root + response.attachmentInfos[i].id );
			    }
			    self.emit('newAttachments',imgSrcs);
			});
			
        },
        /*
         * sets the primaryLayer to the ID of the layer name passed
         * returns true on success
         * returns false if  name does not exist in layerNameAndID does not change primary layer
         */
        setPrimaryLayer: function (layerName) {
            if( this.exists(layerName) ){
                this.primaryLayer = layerName;
                return true;
            }
            return false;
        },
        /*
         * adds the layer of layername to the map
         */
        addLayer: function (layerName) {
            var newlayerName = this.pnameToIndex(layerName);
            if (!newlayerName) {
                return;
            }
            var featLayer = new FeatureLayer(this.restURI + newlayerName);
            featLayer.attr('name', this.primaryLayer);
            //set new layer to position 0
            this.myMap.addLayer(featLayer, 0);
            //we know it's at 0, get map's identifying name from layer 0
            this.psetNewLayerId(layerName,this.myMap.graphicsLayerIds[0]);
        },
        /*
         * checks that layerName is a valid layer and not the primary layer
         * removes layer layerName
         * returns false on error
         * true on success 
         */
        removeLayer: function(layerName) {
            if(layerName == this.primaryLayer){//dont remove the primary layer. ever. 
                return false;
            }

            var removeMe = this.pTranslateLayerName(layerName);
            if (removeMe) {
                this.myMap.removeLayer();
                return true;
            }
            console.log(layerName + " unKnown value for remove.");
            return false;
        },
        /*
         * returns true if the layer name sent exists in
         * the layerNameAndID object
         */
        exists: function(checkFor){
            for (var i = 0; i < this.layerNameAndID.length; i++) {
                if(this.layerNameAndID[i].name == checkFor){
                    return true;
                }
            }
            return false;
        },
/*
* the following should be considered 'private' methods
* this is denoted with the 'method call' starting with a p
*
*/
        
        psendQuery: function (queryObject, updateAttachments) {
            var primaryID = this.pTranslateLayerName(this.primaryLayer);
            if (!primaryID) {//if name doesn't translate
                this.emit('dataError', { error: 'primary layer invalid' }); //this is a page killing error
                return null;// cut the circuit before we cause damage
            }
            queryObject.outSpatialReference = this.myMap.spatialReference;
            queryObject.returnGeometry = false;

            var url = this.myMap.getLayer(primaryID).url;//get url of selected layer
            var queryTask = new QueryTask(url);
            var self = this;
            queryTask.execute(queryObject, function (results) {//each index in features is a different dataset not a different feature
                if (results.features.length != 0) {//if there is data at clicked location
                    //returns only the data we care about from the query. if the features use associate tables need to link it to the value in fields
                    //see buisness layer functions for how we do this
                    if (updateAttachments) {
                       self.theAttachments( results.features[0].attributes.OBJECTID);
                    }
                    //tell codebase success
                    self.emit('dataRetrieval', { features: results.features, fields: results.fields });
                } else {
                    //tell codebase fail, kinda pointless but good for testing
                    //all this means is there was no data at the point, which is
                    //completely possible. Do Not Kill page on this emit
                    self.emit('dataFail', { error: 'results not found' });
                }

            });
        },


        /*
         * event handler for on click event
         * queries for data on the passed layer at the point clicked 
         */
        pclickHandler: function (event) {
            var point = event.mapPoint;
            qGeom = this.pmakeGeometryExtent(point);
            var query = new Query();
            query.geometry = qGeom;          
            query.outFields = ['*'];
            this.psendQuery(query,true);           
        },
        /*
         *helper function for reading click locations
         * padds radius to about mouse size. this is esri's recomended algorithm. 
         * Depending on prefered zoom level might require some editing though not recommended
         * we played with it some and had some very strange selection areas, think esri knows better
         */
        pmakeGeometryExtent(point) {
            pxWidth = this.myMap.extent.getWidth() / this.myMap.width;
            padding = 4 * pxWidth;
            return new esri.geometry.Extent({
                "xmin": point.x - padding,
                "ymin": point.y - padding,
                "xmax": point.x + padding,
                "ymax": point.y + padding,
                "spatialReference": point.spatialReference
            });
        },
        /*
         * sets layerNameAndID variale
         * {name: LAYER NAME, id: LAYER ID, index: RESTSERVICE feature layer identifying number }
         * does this for all graphics layers
         */
        psetLayerNameToID: function () {//TODO: needs refactoring
            var layerIDs = this.myMap.graphicsLayerIds;
            this.layerNameAndID = [];
            for (var i = 0; i < layerIDs.length; i++) {
                var jsonData = this.myMap.getLayer(layerIDs[i])._json;
                jsonData = JSON.parse(jsonData);
                //save as name : ID pairs. we want to user to see the names,
                //but we need the ID to call for more data so we'll store them together
                var temp = { id: layerIDs[i], name: jsonData.name, index: jsonData.id };
                this.layerNameAndID.push(temp);
                
            }
            //set a default primary layer
            this.primaryLayer = this.layerNameAndID[0].name;
        },
        /*
         * returns the layer index of passed layer name
         * or null if DNE
         */
		pnameToIndex: function(layerName){
			var self = this;
            for (var i = 0; i < self.layerNameAndID.length; i++) {
                if (self.layerNameAndID[i].name == layerName) {
                    return self.layerNameAndID[i].index;
                }
            }
            return null;
		},
        /*
         * returns the layer id associatiated with the passed name
         * or null if DNE
         */
        pTranslateLayerName: function (which) {
            var self = this;
            for (var i = 0; i < self.layerNameAndID.length; i++) {
                if (self.layerNameAndID[i].name == which) {
                    return self.layerNameAndID[i].id;
                }
            }
            return null;
        },
        /*
         *returns the layerName of the passed layerID
         *or null if DNE
         */
        pTranslateLayerID: function(which){
            var self = this;
            for (var i = 0; i < self.layerNameAndID.length; i++) {
                if (self.layerNameAndID[i].id == which) {
                    return self.layerNameAndID[i].name;
                }
            }
            return null;
        },
        /*
         *returns the layer index of passed layer id
         * or null if DNE
         */
        pidToIndex: function (which) {
            var self = this;
            for (var i = 0; i < self.layerNameAndID.length; i++) {
                if (self.layerNameAndID[i].id == which) {
                    return self.layerNameAndID[i].index;
                }
            }
            return null;
        },
        /*
         * when the graphics layer is added and removed their identifier changes
         * this function is used to keep track of those changes
         *
         * sets the id of the stored layer data with name which
         * returns boolean
         */
        psetNewLayerId: function (which, newId) {
            var self = this;
            for (var i = 0; i < self.layerNameAndID.length; i++) {
                if (self.layerNameAndID[i].name == which) {
                    self.layerNameAndID[i].id = newId;
                    return true;
                }
            }
            return false;
        }
    });
});