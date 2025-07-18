import request from 'supertest';
import express from 'express';
import * as authService from '../../services/auth.service';
import { register, login } from '../../controllers/auth.controller';

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

// Mock the service
jest.mock('../../services/auth.service');

const mockRegister = authService.registerUser as jest.Mock;
const mockLogin = authService.loginUser as jest.Mock;

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

//
// #1 - REGISTER
//

// - Should return 200 and token when registration is successful
test('#1 - register - returns 200 and token on success', async () => {
    mockRegister.mockResolvedValue({ success: true, token: 'mock-token' });

    const res = await request(app).post('/register').send({
        UserName: 'TestUser',
        Email: 'test@example.com',
        Password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mock-token');
    expect(mockRegister).toHaveBeenCalledWith('TestUser', 'test@example.com', '123456');
});

// - Should return 400 if registration fails
test('#2 - register - returns 400 if service fails', async () => {
    mockRegister.mockResolvedValue({ success: false, error: 'Email already exists' });

    const res = await request(app).post('/register').send({
        UserName: 'TestUser',
        Email: 'test@example.com',
        Password: '123456',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already exists');
});

//
// #2 - LOGIN
//

// - Should return 200 and token on successful login
test('#3 - login - returns 200 and token on success', async () => {
    mockLogin.mockResolvedValue({ success: true, token: 'mock-token' });

    const res = await request(app).post('/login').send({
        Email: 'test@example.com',
        Password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mock-token');
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', '123456');
});

// - Should return 400 if login fails
test('#4 - login - returns 400 on failure', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });

    const res = await request(app).post('/login').send({
        Email: 'wrong@example.com',
        Password: 'wrongpassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid credentials');
});

// - Should return 500 if login throws unexpected error
test('#5 - login - returns 500 on unexpected error', async () => {
    mockLogin.mockRejectedValue(new Error('Unexpected error'));

    const res = await request(app).post('/login').send({
        Email: 'test@example.com',
        Password: '123456',
    });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
});
