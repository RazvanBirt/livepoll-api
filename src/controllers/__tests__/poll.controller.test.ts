import request from 'supertest';
import express from 'express';
import * as pollService from '../../services/poll.service';
import { poll, getPolls, getPollByIdDetailed } from '../poll.controller';

const app = express();
app.use(express.json());
app.post('/poll', poll);
app.get('/polls', getPolls);
app.get('/poll/:id', getPollByIdDetailed);

// Mock the service
jest.mock('../../services/poll.service');

const mockCreatePoll = pollService.createPoll as jest.Mock;
const mockGetAllPolls = pollService.getAllPolls as jest.Mock;
const mockGetPollByIdDetailed = pollService.getPollDetailed as jest.Mock;

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

//
// # POST /poll
//

test('#1 - POST /poll - should create poll successfully', async () => {
    const mockPoll = {
        ID: 'poll-1',
        Title: 'Test Poll',
        Description: 'A description',
        Question: 'A question?',
        UserID: 'user-1',
        Options: [{ ID: 'opt1', Text: 'Yes' }, { ID: 'opt2', Text: 'No' }],
        Settings: { AllowMultipleVotes: true }
    };

    mockCreatePoll.mockResolvedValue(mockPoll);

    const res = await request(app)
        .post('/poll')
        .send({
            Title: 'Test Poll',
            Description: 'A description',
            Question: 'A question?',
            Options: ['Yes', 'No'],
            UserID: 'user-1',
            Settings: { AllowMultipleVotes: true }
        });

    expect(res.status).toBe(201);
    expect(res.body.ID).toBe('poll-1');
});

test('#2 - POST /poll - should fail with missing required fields', async () => {
    const res = await request(app)
        .post('/poll')
        .send({
            Title: '',
            Description: '',
            Question: '',
            Options: [],
            UserID: '',
            Settings: { AllowMultipleVotes: true }
        });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
});

test('#3 - POST /poll - should fail if less than two options', async () => {
    const res = await request(app)
        .post('/poll')
        .send({
            Title: 'Test',
            Description: 'Desc',
            Question: 'Q?',
            Options: ['Only one'],
            UserID: 'user-1',
            Settings: { AllowMultipleVotes: true }
        });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/at least two items/);
});


//
// # GET /polls
//

test('#4 - GET /polls - returns formatted polls', async () => {
    mockGetAllPolls.mockResolvedValue([
        {
            ID: 'poll-1',
            Title: 'Test',
            Description: 'Desc',
            Question: 'Q?',
            CreatedAt: new Date(),
            User: { ID: 'u1', UserName: 'User', Email: 'user@example.com' },
            Options: [
                {
                    ID: 'opt1',
                    Text: 'A',
                    Votes: [{ User: { ID: 'u1', UserName: 'User', Email: 'user@example.com' } }]
                }
            ]
        }
    ]);

    const res = await request(app).get('/polls');

    expect(res.status).toBe(200);
    expect(res.body[0].Options[0].voteCount).toBe(1);
});


//
// # GET /poll/:id
//

test('#5 - GET /poll/:id - returns formatted poll details', async () => {
    mockGetPollByIdDetailed.mockResolvedValue({
        ID: 'poll-1',
        Title: 'Test',
        Description: 'Desc',
        Question: 'Q?',
        CreatedAt: new Date(),
        User: { ID: 'u1', UserName: 'User', Email: 'user@example.com' },
        Options: [
            {
                ID: 'opt1',
                Text: 'A',
                Votes: [{ User: { ID: 'u1', UserName: 'User', Email: 'user@example.com' } }]
            }
        ]
    });

    const res = await request(app).get('/poll/poll-1');

    expect(res.status).toBe(200);
    expect(res.body.ID).toBe('poll-1');
    expect(res.body.Options[0].voteCount).toBe(1);
});

test('#6 - GET /poll/:id - returns 404 if poll not found', async () => {
    mockGetPollByIdDetailed.mockResolvedValue(null);

    const res = await request(app).get('/poll/non-existent-id');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Poll not found');
});
