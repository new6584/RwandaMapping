/*
    load in graph api
    functions to interact with graph api
*/

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart(dataTable) {

var data = google.visualization.arrayToDataTable(dataTable);

var options = {
	title: 'Businesses by Quarter',
	colors: ['#800080', '#8c198c', '#993299', '#a64ca6', '#b266b2', '#bf7fbf', '#cc99cc'],
	backgroundColor: '#cccccc'
};

var chart = new google.visualization.PieChart(document.getElementById('piechart'));

chart.draw(data, options);
}