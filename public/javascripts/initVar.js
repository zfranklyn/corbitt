function processData(d){

	// updates variable define in index called "sdata"
	// has all data for each variable as array according to key in JSON object
	initsdata(d);

	console.log("data processing complete");

	initializeVariables(sdata);


	// refer to eat.js
	initializeEAT();

}

function initsdata(d){
	// this variable is pulled from our index page
	sdata = {};

	// number of vars according to first row of data
	var numVariables = Object.keys(d[0]).length;
	var numParticipants = d.length;

	// for each variable:
	for (var key in d[0]){
		// for each participant:
		var dataArray = []

		for (var i = 0; i < numParticipants; i++){
			var currentDataPoint = d[i][key]
			dataArray.push(parseFloat(currentDataPoint))
		}

		sdata[key] = dataArray;
	}

};

function initializeVariables(d){
	var varListTemplate = $("#variables-list-template")[0];
	var varList = $("#variables-list")[0];

	dataArray = []


	for (var key in d){
		var temp = {}

		var currentArray = d[key].filter(function(d){
			return !isNaN(d)
		})

		
		var mean = ss.mean(currentArray)
		var median = ss.median(currentArray)
		var min = ss.min(currentArray)
		var mode = ss.mode(currentArray)
		var max = ss.max(currentArray)
		var variance = ss.variance(currentArray)

		temp.name = key
		temp.mean = ss.mean(currentArray)
		temp.median = ss.median(currentArray)
		temp.min = ss.min(currentArray)
		temp.mode = ss.mode(currentArray)
		temp.max = ss.max(currentArray)
		temp.variance = ss.variance(currentArray)
		temp.N = d[key].length
		temp.missing = d[key].length - currentArray.length

		dataArray.push(temp)
	}

	var templates = {
		renderVarList: Handlebars.compile(varListTemplate.innerHTML)
	}

	varList.innerHTML = templates.renderVarList({variables:dataArray})

}
















