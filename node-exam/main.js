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
	tagsToFind.forEach(function(tag) {
		if(tag) {
			results.push({ tag: tag, count: 0 });
		}
	});

	// get file list
	fs.readdir(dataDir, function(err, files) {
		if(err) { throw err; }

		// construct array of data files to load
		files.forEach(function(file) {
			dataFiles.push(dataDir + file);
		});

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
							result.count += 1;
						}
					});
				}
			});
		}

		if(dataFiles[currentFile+1]) {
			// process next file
			currentFile += 1;
			processNextFile();
		} else {
			// sort results by popularity
			results.sort(sortTags);
			
			console.log('-----------------');
			results.forEach(function(elem) {
				console.log(elem.tag + '\t\t' + elem.count);
			});
			console.log('-----------------');
		}
	});
}

function sortTags(a, b) {
	return b.count - a.count;
}
