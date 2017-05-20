const {get} = require('microrouter');
const {send} = require('micro');

const hello = async (req, res) => {
	if (req.params.who === 'Lucas') {
		throw new Error('NOT YOU!');
	}
	send(res, 200, await Promise.resolve({msg: `Hello ${req.params.who}`}));
};

module.exports = [
	get('/hello/:who', hello)
];
