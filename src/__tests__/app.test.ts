import request from 'supertest';
import express from 'express';
import * as routes from '../routes/index';
import http from 'http';
import { setupSocketIO } from '../socket';

// Mock routes
jest.mock('../routes/index', () => express.Router().get('/test', (req, res, next) => {
    res.json({ ok: true });
    next();
}));
jest.mock('../socket', () => ({
    setupSocketIO: jest.fn().mockReturnValue({ on: jest.fn(), emit: jest.fn() }),
}));

describe('App Initialization', () => {
    let app: express.Express;

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const mod = require('../app');
        app = mod.app; // use Express app directly
    });

    afterAll(() => {
        (console.log as jest.Mock).mockRestore();
    });

    test('should respond to /api/test', async () => {
        const res = await request(app).get('/api/test');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true });
    });

    test('should set io in app locals', () => {
        expect(app.get('io')).toBeDefined();
    });
});
