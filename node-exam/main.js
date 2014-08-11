var tag_finder = require('./modules/tag_finder');

if(process.argv.length < 3) {
	console.error('Usage: node main.js [tag_file]');
	return;
}

var tagsFile = process.argv[2];
var dataDir = 'data/';

tag_finder.find_tags(tagsFile, dataDir, function(results) {
	console.log('-----------------');
	
	results.forEach(function(elem) {
		console.log(elem.tag + '\t\t' + elem.count);
	});

	console.log('-----------------');
});