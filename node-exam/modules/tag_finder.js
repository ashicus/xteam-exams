var fs = require('fs');

function find_tags(tagsFile, dataDir, onComplete) {
	var dataFiles = [];
	var tagsToFind = [];
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
			processFile(0);
		});
	});

	// process a single file
	function processFile(index) {
		var file = dataFiles[index];

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
				// search for matching tags
				getTagsFromObject(dataObj).forEach(function(tag) {
					if(tagsToFind.indexOf(tag) > -1) {
						results.forEach(function(result) {
							if(result.tag === tag) {
								result.count += 1;
							}
						});
					}
				});
			}

			if(dataFiles[index+1]) {
				// process next file
				index += 1;
				processFile(index);
			} else {
				// sort results by popularity
				results.sort(sortTags);
				onComplete(results);
			}
		});
	}

	// extract tags from a data object
	function getTagsFromObject(obj) {
		var tags = obj.tags || [];

		// check for child objects
		if(obj.children) {
			obj.children.forEach(function(child) {
				if(child.tags) {
					tags = tags.concat(child.tags);
				}
			});
		}

		return tags;
	}

	function sortTags(a, b) {
		return b.count - a.count;
	}
}

exports.find_tags = find_tags;