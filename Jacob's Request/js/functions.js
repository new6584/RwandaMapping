/*
    
*/
function fillSingleOutput(arrayF) {
	for(var index in arrayF) {
		if(!arrayF.hasOwnProperty(index)){
			continue;
		}
		document.getElementById(index).appendChild(document.createTextNode(arrayF[index]));
        //$("#"+index).append($(arrayF[index])); <-- query implementation. 10x easier. recomend looking into it
	}
}