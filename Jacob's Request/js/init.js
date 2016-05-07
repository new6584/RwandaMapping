/*rename to something?

*/
function initializePage() {
    $("#controlLooper").hide();
    //add listeners
    $("#layerSelect").change(layerChange);
    $("#filterSelect").change(filterChange);
    updateLayers();

    clearDataFields();
}
/*
updateLayers();
var dataTable = [
  ["Quarter", "Population "],
  ["Quarter 1", 117],
  ["Quarter 2", 137],
  ["Quarter 3", 142],
  ["Quarter 4", 198],
  ["Quarter 5", 336],
  ["Quarter 6", 339],
  ["Quarter 7", 1045]
];
drawChart(dataTable);
clearDataFields();
*/