var fs = require('fs');

var tagsFile = 'tags.txt';
var tagsToFind = [];

var dataDir = 'data/';
var dataFiles = [];
var currentFile = 0;

var results = [];

// read tags file
fs.readFile(tagsFile, function (err, data) {
	if(err) { throw err; }

	tagsToFind = data.toString().split('\n');
	tagsToFind.forEach(function(elem) {
		if(elem) {
			results.push({ tag: elem, count: 0 });
		}
	});

	// get file list
	fs.readdir(dataDir, function(err, files) {
		if(err) { throw err; }

		// construct array of data files to load
		for(var i in files) {
			dataFiles.push(dataDir + files[i]);
		}

		// start the process of loading the data files
		processNextFile();
	});
});

function processNextFile() {
	var file = dataFiles[currentFile];

	fs.readFile(file, function (err, data) {
		if(err) { throw err; }

		// parse the JSON
		var dataObj;
		try {
			dataObj = JSON.parse(data);
		} catch(err) {
			console.error('ERROR: invalid JSON in ' + file);
		}

		if(dataObj) {
			var tags = dataObj.tags || [];

			// check for child objects
			if(dataObj.children) {
				for(var i in dataObj.children) {
					if(dataObj.children[i].tags) {
						tags = tags.concat(dataObj.children[i].tags);
					}
				}
			}

			// search for matching tags
			tags.forEach(function(tag) {
				if(tagsToFind.indexOf(tag) > -1) {
					results.forEach(function(result) {
						if(result.tag === tag) {
							result.count++;
						}
					});
				}
			});
		}

		if(dataFiles[++currentFile]) {
			// process next file
			processNextFile();
		} else {
			// sort results by popularity
			results.sort(sortTags);
			
			console.log('--------');
			results.forEach(function(elem) {
				console.log(elem.tag + ': ' + elem.count);
			});
			console.log('--------');
		}
	});
}

function sortTags(a, b) {
	return b.count - a.count;
}
