var tag_finder = require('./modules/tag_finder');

var tagsFile = 'tags.txt';
var dataDir = 'data/';

tag_finder.find_tags(tagsFile, dataDir, function(results) {
	console.log('-----------------');
	
	results.forEach(function(elem) {
		console.log(elem.tag + '\t\t' + elem.count);
	});

	console.log('-----------------');
});