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
        //clear data field
        var filterByOptions = [];
        for (var i = 0; i < name.length; i++) {
            addDataElement(name[i], value[i]);
            if($.isNumeric(value[i])){
                filterByOptions.push(name[i]);
            }
        }
        newFilterOptions(filterByOptions);
}
/*
 * adds a single name value pair to the data table
 * TODO
 */
function addDataElement(name,value) {

}
/*
 * replaces filter by selector with options
 * TODO
 */
function newFilterOptions(options) {

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