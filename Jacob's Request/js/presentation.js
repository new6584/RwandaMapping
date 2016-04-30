/*
$(document).ready(function () {
    blueimp.Gallery(
    document.getElementById('links').getElementsByTagName('a'),
    {
        container: '#blueimp-gallery-carousel',
        carousel: true
    }
);
});
*/
var ignoreFields = ["OBJECTID", "GlobalID"];
function appendData(name, value) {
    if (($.inArray(name, ignoreFields) == -1) && value ) {//if is not in ignore array or empty value
        var element = $("<tr></tr>");
        var title = $("<td class='titles'>" + name + "</td>");
        var fieldData;
        if ($.isNumeric(value)) {
            var json = '{"value":"' + value + '", "name":"' + name + '" }';
            fieldData = $("<td><label class='dataValues'>" + value + "<input type='checkbox' value='" + json + "'></label></td>");
        } else {
            fieldData = $("<td><label class='dataValues'>" + value + "</label></td>");
        }
        element.append(title);
        element.append(fieldData);
        $("#dataFields").append(element);
    }
}

function addAttachment() {

}

function clearAttachments() {

}

function clearDataTable() {
    $("#dataFields").empty();
}