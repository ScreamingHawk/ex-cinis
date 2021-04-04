var glob = require('glob'),
	path = require('path')

glob.sync('./tasks/**/*.js').forEach(function (file) {
	require(path.resolve(file))
})
