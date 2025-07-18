
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            poll: {
                create: mockCreate,
                findMany: mockFindMany,
                findUnique: mockFindUnique,
            },
        })),
    };
});

import { createPoll, getAllPolls, getPollDetailed } from '../poll.service';

const userId = 'user-123';
const mockOptions = ['Option A', 'Option B'];

beforeEach(() => {
    jest.clearAllMocks();
});

//
// #1 - createPoll - creates a poll with options and settings
//
test('#1 - creates a poll with options and settings', async () => {
    const mockPoll = {
        ID: 'poll-1',
        Title: 'Test Poll',
        Description: 'Description',
        Question: 'Your favorite?',
        UserID: userId,
        Options: mockOptions.map((text, i) => ({
            ID: `opt-${i + 1}`,
            Text: text,
        })),
        Settings: {
            AllowMultipleVotes: true,
        },
    };

    mockCreate.mockResolvedValue(mockPoll);

    const result = await createPoll(
        'Test Poll',
        'Description',
        'Your favorite?',
        mockOptions,
        userId,
        { AllowMultipleVotes: true }
    );

    expect(mockCreate).toHaveBeenCalled();
    expect(result.Options).toHaveLength(2);
    expect(result.Settings?.AllowMultipleVotes).toBe(true);
});

//
// #2 - returns all polls
//
test('#2 - returns all polls', async () => {
    const mockData = [
        { ID: 'poll-1', Title: 'Poll 1' },
        { ID: 'poll-2', Title: 'Poll 2' },
    ];

    mockFindMany.mockResolvedValue(mockData);

    const result = await getAllPolls();

    expect(mockFindMany).toHaveBeenCalled();
    expect(result.length).toBe(2);
    expect(result[0].Title).toBe('Poll 1');
});

//
// #3 -  returns poll with matching ID
//
test('#3 - returns poll with matching ID', async () => {
    const mockPoll = {
        ID: 'poll-abc',
        Title: 'Detailed Poll',
        Options: [],
        User: { ID: userId, UserName: 'TestUser', Email: 'test@example.com' },
    };

    mockFindUnique.mockResolvedValue(mockPoll);

    const result = await getPollDetailed('poll-abc');

    expect(mockFindUnique).toHaveBeenCalledWith({
        where: { ID: 'poll-abc' },
        include: expect.anything(),
    });

    expect(result?.Title).toBe('Detailed Poll');
});

//
// #4 - applies default AllowMultipleVotes when not provided
//
test('#4 - applies default AllowMultipleVotes when not provided', async () => {
    const mockPoll = {
        ID: 'poll-1',
        Title: 'Poll',
        Description: 'Desc',
        Question: 'Q?',
        UserID: userId,
        Options: [],
        Settings: { AllowMultipleVotes: false },
    };

    mockCreate.mockResolvedValue(mockPoll);

    const result = await createPoll(
        'Poll',
        'Desc',
        'Q?',
        mockOptions,
        userId,
        {} as any
    );

    expect(result.Settings?.AllowMultipleVotes).toBe(false);
});

//
// #5 - returns empty array when no polls exist
//
test('#5 - returns empty array when no polls exist', async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getAllPolls();

    expect(result).toEqual([]);
});

//
// #6 - returns undefined when poll ID is invalid
//
test('#6 - returns undefined when poll ID is invalid', async () => {
    mockFindUnique.mockResolvedValue(undefined);

    const result = await getPollDetailed('nonexistent-id');

    expect(result).toBeUndefined();
});
