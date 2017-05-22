import {test} from 'ava';
import request from 'supertest';
import {server} from '../index';

test('replies to a given name', async t => {
	const res = await request(server)
    .get('/hello/Leo')
    .send();

	t.is(res.status, 200);
	t.deepEqual(res.body, {msg: 'Hello Leo'});
});

test('does not like my name', async t => {
	const res = await request(server)
    .get('/hello/Lucas')
    .send();

	t.is(res.status, 500);
	t.deepEqual(res.body, {error: 'NOT YOU!'});
});

test('does not know other routes', async t => {
	const res = await request(server)
    .get('/unknown')
    .send();

	t.is(res.status, 404);
	t.deepEqual(res.body, {error: 'Not Found'});
});
