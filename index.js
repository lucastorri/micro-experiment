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
const server = micro(handler).listen(3000);

process.once('SIGINT', () => {
	server.close(process.exit);
});
