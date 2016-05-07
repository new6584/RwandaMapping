/*
    load in graph api
    functions to interact with graph api
*/


google.charts.load('current', { 'packages': ['corechart', 'table'] });
//we dont want it to do anything on callback

//piechart
function drawChart(dataTable, title) {
    console.log(dataTable);
    var data = google.visualization.arrayToDataTable(dataTable);

    var options = {
	    title: title,
	    backgroundColor: '#999999'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
//data table
function drawTable(valueArray) {
    var tableData = new google.visualization.DataTable();
    tableData.addColumn('string',"Field Name");
    tableData.addColumn('string',"Value");
    tableData.addRows(valueArray);
    var options = {
        width: '100%'
        };

    var table = new google.visualization.Table(document.getElementById('singleOutput'));
    table.draw(tableData, options);
}