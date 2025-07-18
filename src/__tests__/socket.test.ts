import { setupSocketIO } from '../socket';
import { verifyToken } from '../utils/verifyToken';
import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

jest.mock('../utils/verifyToken');

const mockVerifyToken = verifyToken as jest.Mock;

describe('Socket.IO Setup', () => {
    let httpServer: HTTPServer;
    let io: Server;
    let addr: string;

    beforeAll((done) => {
        httpServer = new HTTPServer();
        io = setupSocketIO(httpServer);
        httpServer.listen(() => {
            const port = (httpServer.address() as any).port;
            addr = `http://localhost:${port}`;
            done();
        });
    });

    afterAll((done) => {
        io.close();
        httpServer.close(done);
    });

    test('1# - should reject connection without token', (done) => {
        const client = Client(addr, { auth: {} });
        client.on('connect_error', (err: any) => {
            expect(err.message).toContain('Unauthorized: No token');
            client.close();
            done();
        });
    });

    test('2# - should reject connection with invalid token', (done) => {
        mockVerifyToken.mockImplementation(() => { throw new Error('Invalid'); });
        const client = Client(addr, { auth: { token: 'badtoken' } });
        client.on('connect_error', (err: any) => {
            expect(err.message).toContain('Unauthorized: Invalid token');
            client.close();
            done();
        });
    });

    test('3# - should accept connection with valid token and handle events', (done) => {
        mockVerifyToken.mockReturnValue({ email: 'test@example.com' });

        const client = Client(addr, { auth: { token: 'validtoken' } });
        client.on('connect', () => {
            client.emit('poll:join', 'poll-1');
            setTimeout(() => {
                expect(client.connected).toBe(true);
                client.close();
                done();
            }, 100);
        });
    });
});
