const mockFindUnique = jest.fn();
const mockCreate = jest.fn();

// BD mock
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            user: {
                create: mockCreate,
                findUnique: mockFindUnique,
            },
        })),
    };
});

// Bcrypt mock
const mockGenSalt = jest.fn();
const mockHash = jest.fn();
const mockCompare = jest.fn();

jest.mock('bcrypt', () => ({
    genSalt: mockGenSalt,
    hash: mockHash,
    compare: mockCompare,
}));

// JWT mock
const mockJwtSign = jest.fn();

jest.mock('jsonwebtoken', () => ({
    sign: mockJwtSign,
}));

import { registerUser, loginUser } from '../auth.service';

beforeEach(() => {
    jest.clearAllMocks();
});

//
// # registerUser
//

test('#1 - registerUser - should register and return token if email not in use', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockGenSalt.mockResolvedValue('salt');
    mockHash.mockResolvedValue('hashedPassword');
    mockCreate.mockResolvedValue({
        ID: 'user-123',
        Email: 'test@example.com',
    });
    mockJwtSign.mockReturnValue('mock-token');

    const result = await registerUser('TestUser', 'test@example.com', 'password123');

    expect(mockFindUnique).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.token).toBe('mock-token');
});

test('#2 - registerUser - should fail if email already registered', async () => {
    mockFindUnique.mockResolvedValue({ ID: 'existing-user' });

    const result = await registerUser('TestUser', 'test@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Email already registered');
});

//
// # loginUser
//

test('#3 - loginUser - should login and return token on valid credentials', async () => {
    mockFindUnique.mockResolvedValue({
        ID: 'user-123',
        Email: 'test@example.com',
        Password: 'hashedPassword',
    });
    mockCompare.mockResolvedValue(true);
    mockJwtSign.mockReturnValue('mock-token');

    const result = await loginUser('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.token).toBe('mock-token');
});

test('#4 - loginUser - should fail if user not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await loginUser('notfound@example.com', 'password');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
});

test('#5 - loginUser - should fail if password is incorrect', async () => {
    mockFindUnique.mockResolvedValue({
        ID: 'user-123',
        Password: 'hashedPassword',
    });
    mockCompare.mockResolvedValue(false);

    const result = await loginUser('test@example.com', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
});
