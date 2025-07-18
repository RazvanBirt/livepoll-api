// Mock PrismaClient
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockFindManyVotes = jest.fn();
const mockTransaction = jest.fn((actions) => Promise.all(actions));

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            pollOption: {
                findMany: mockFindMany,
            },
            vote: {
                findFirst: mockFindFirst,
                findMany: mockFindManyVotes,
                create: mockCreate,
            },
            $transaction: mockTransaction,
        })),
    };
});

import { castVotes } from '../vote.service';

beforeEach(() => {
    jest.clearAllMocks();
});

//
// # castVotes tests
//

test('#1 - should throw error if some options do not exist', async () => {
    mockFindMany.mockResolvedValue([]); // No options found

    await expect(castVotes('user-1', ['invalid-option']))
        .rejects
        .toThrow('Some options do not exist');

    expect(mockFindMany).toHaveBeenCalledWith({
        where: { ID: { in: ['invalid-option'] } },
        include: { Poll: { include: { Settings: true } } },
    });
});

test('#2 - should throw error if user already voted and multiple votes not allowed', async () => {
    mockFindMany.mockResolvedValue([
        {
            ID: 'option-1',
            PollID: 'poll-1',
            Poll: { Settings: { AllowMultipleVotes: false } },
        },
    ]);

    mockFindFirst.mockResolvedValue({ ID: 'vote-1' });

    await expect(castVotes('user-1', ['option-1']))
        .rejects
        .toThrow('User has already voted in this poll');
});

test('#3 - should create a vote if multiple votes allowed', async () => {
    mockFindMany.mockResolvedValue([
        {
            ID: 'option-1',
            PollID: 'poll-1',
            Poll: { Settings: { AllowMultipleVotes: true } },
        },
    ]);

    mockFindManyVotes.mockResolvedValue([]);
    mockCreate.mockResolvedValue({
        ID: 'vote-123',
        OptionID: 'option-1',
        UserID: 'user-1',
    });

    const result = await castVotes('user-1', ['option-1']);

    expect(mockCreate).toHaveBeenCalledWith({
        data: {
            OptionID: 'option-1',
            UserID: 'user-1',
            CreatedBy: 'user-1',
            ModifiedBy: 'user-1',
        },
    });

    expect(result).toEqual({
        votes: [
            {
                ID: 'vote-123',
                OptionID: 'option-1',
                UserID: 'user-1',
            },
        ],
        pollId: 'poll-1',
    });
});

test('#4 - should create a vote if no previous vote exists and multiple votes not allowed', async () => {
    mockFindMany.mockResolvedValue([
        {
            ID: 'option-1',
            PollID: 'poll-1',
            Poll: { Settings: { AllowMultipleVotes: false } },
        },
    ]);

    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
        ID: 'vote-123',
        OptionID: 'option-1',
        UserID: 'user-1',
    });

    const result = await castVotes('user-1', ['option-1']);

    expect(result.votes[0].ID).toBe('vote-123');
    expect(result.pollId).toBe('poll-1');
});
