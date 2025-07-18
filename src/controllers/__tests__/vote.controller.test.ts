import request from 'supertest';
import express from 'express';
import { vote } from '../../controllers/vote.controller';
import * as voteService from '../../services/vote.service';
import * as pollService from '../../services/poll.service';

jest.mock('../../services/vote.service');
jest.mock('../../services/poll.service');

const mockCastVotes = voteService.castVotes as jest.Mock;
const mockGetPollDetailed = pollService.getPollDetailed as jest.Mock;
const mockGetAllPolls = pollService.getAllPolls as jest.Mock;

const app = express();
app.use(express.json());

// Simulate req.user
app.use((req: any, res, next) => {
    req.user = { id: 'user-1' };
    req.app.set('io', { emit: jest.fn(), to: jest.fn().mockReturnThis() }); // mock socket.io
    next();
});

app.post('/vote', vote);

beforeEach(() => {
    jest.clearAllMocks();
});

//
// TESTS
//

test('#1 - should return 400 if OptionID is missing', async () => {
    const res = await request(app).post('/vote').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('OptionID');
});

test('#2 - should return 400 if OptionID is not a string or array of strings', async () => {
    const res = await request(app).post('/vote').send({ OptionID: 123 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Each OptionID must be a string');
});

test('#3 - should return 201 with votes when voting is successful', async () => {
    mockCastVotes.mockResolvedValue({
        votes: [{ ID: 'vote-1', OptionID: 'option-1', UserID: 'user-1' }],
        pollId: 'poll-1',
    });

    mockGetPollDetailed.mockResolvedValue({
        ID: 'poll-1',
        Title: 'Poll Title',
        Description: 'Poll Description',
        Question: 'Poll Question?',
        CreatedAt: new Date(),
        User: { ID: 'user-1', UserName: 'TestUser' },
        Options: [
            {
                ID: 'option-1',
                Text: 'Option 1',
                Votes: [{ User: { ID: 'user-1', UserName: 'TestUser' } }],
            },
        ],
    });

    mockGetAllPolls.mockResolvedValue([
        { ID: 'poll-1', Title: 'Poll Title', Question: 'Poll Question?' },
    ]);

    const res = await request(app).post('/vote').send({ OptionID: 'option-1' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual([
        { ID: 'vote-1', OptionID: 'option-1', UserID: 'user-1' },
    ]);
    expect(mockCastVotes).toHaveBeenCalledWith('user-1', ['option-1']);
    expect(mockGetPollDetailed).toHaveBeenCalledWith('poll-1');
    expect(mockGetAllPolls).toHaveBeenCalled();
});

test('#4 - should return 404 if poll is not found', async () => {
    mockCastVotes.mockResolvedValue({
        votes: [{ ID: 'vote-1', OptionID: 'option-1', UserID: 'user-1' }],
        pollId: 'poll-1',
    });
    mockGetPollDetailed.mockResolvedValue(null); // Poll not found

    const res = await request(app).post('/vote').send({ OptionID: 'option-1' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Poll not found');
});

test('#5 - should return 500 if castVotes throws an error', async () => {
    mockCastVotes.mockRejectedValue(new Error('Unexpected error'));

    const res = await request(app).post('/vote').send({ OptionID: 'option-1' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Unexpected error');
});
