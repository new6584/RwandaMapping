/*rename to something?

*/
function initializePage() {
    $("#controlLooper").hide();
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
}
/**
*
*/
function initTable() {
	var table = document.createElement('table'), tr, td, row, cell;
	var width = 10;
	var height = 25;
	for (row = 0; row < height; row++) {
		tr = document.createElement('tr');
		for (cell = 0; cell < width; cell++) {
			td = document.createElement('td');
			tr.appendChild(td);
			if(row == 0)
				td.innerHTML = "Title " + (row * width + cell + 1);
			else 
				td.innerHTML = "Data  " + ((row-1) * width + cell + 1);
		}
		table.appendChild(tr);
	}
	document.getElementById('dataTable').appendChild(table);
}