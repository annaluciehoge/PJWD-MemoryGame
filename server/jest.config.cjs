module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	globals: {
		'process.env.NODE_ENV': 'test',
	},
};
