#!/usr/bin/env node

const micro = require('micro');
const {router} = require('microrouter');
const visualize = require('micro-visualize');
const compress = require('micro-compress');
const cors = require('micro-cors')({allowMethods: ['GET', 'POST']});
const routes = require('./routes');

const {send} = micro;

const notFound = () => {
	throw Object.assign(new Error('Not Found'), {status: 404});
};

const handleErrors = handler => async (req, res) => {
	try {
		return await handler(req, res);
	} catch (err) {
		const status = err.status ? err.status : 500;
		console.error(err);
		send(res, status, {error: err.message});
	}
};

const main = router(...routes.concat([notFound]));
const handler = [handleErrors, compress, cors, visualize].reduce((h, next) => next(h), main);
const server = micro(handler);

exports.server = server;

if (require.main === module) {
	const port = process.argv[2] || 3000;

	server.on('error', err => {
		console.error(err);
		process.exit(1);
	});

	server.on('listening', () => {
		console.log(`Listening on http://localhost:${port}/`);
	});

	server.listen(port);

	process.once('SIGINT', () => {
		server.close(process.exit);
	});
}
