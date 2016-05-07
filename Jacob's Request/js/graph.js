/*
    load in graph api
    functions to interact with graph api
*/


google.charts.load('current', { 'packages': ['corechart', 'table'] });
//we dont want it to do anything on callback

//piechart
function drawChart(dataTable, title) {
    var data = google.visualization.arrayToDataTable(dataTable);

    var options = {
	    title: title,
	    backgroundColor: '#999999'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    showChart();
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
    showTable();
    var table = new google.visualization.Table(document.getElementById('singleOutput'));
    table.draw(tableData, options);
}