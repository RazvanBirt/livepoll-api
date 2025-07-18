import { createPoll, getAllPolls, getPollDetailed } from '../services/poll.service';
import { Guard } from '../utils/Guard';

export const poll = async (req: any, res: any) => {
    try {
        const body = req.body;

        const result = Guard.againstNullOrUndefinedBulk([
            { argument: body.Title, argumentName: 'Title' },
            { argument: body.Description, argumentName: 'Description' },
            { argument: body.Question, argumentName: 'Question' },
            { argument: body.Options, argumentName: 'Options' },
            { argument: body.UserID, argumentName: 'UserID' },
            { argument: body.UserID, argumentName: 'UserID' },
            { argument: body.Settings.AllowMultipleVotes, argumentName: 'Settings.AllowMultipleVotes' },
        ]);

        if (!result.succeeded) {
            res.status(400).json({
                error: `${result.argumentName} is a required field.`,
            });
            return;
        }

        if (!Array.isArray(body.Options) || body.Options.length < 2) {
            res.status(400).json({ error: 'Options must contain at least two items.' });
            return
        }

        // Use default settings if not provided
        const settings = {
            AllowMultipleVotes: body.Settings?.AllowMultipleVotes ?? false,
        };

        const poll = await createPoll(
            body.Title,
            body.Description,
            body.Question,
            body.Options,
            body.UserID,
            settings
        );

        res.status(201).json(poll);
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const getPolls = async (req: any, res: any) => {
    try {
        const polls = await getAllPolls();
        // TODO: Find a Solution funtion to format the poll etails
        const formattedPolls = polls.map(poll => ({
            ID: poll.ID,
            Title: poll.Title,
            Description: poll.Description,
            Question: poll.Question,
            CreatedAt: poll.CreatedAt,
            User: poll.User,
            Options: poll.Options.map(option => ({
                ID: option.ID,
                Text: option.Text,
                voteCount: option.Votes.length,
                Voters: option.Votes.map(vote => vote.User),
            })),
        }));

        res.status(200).json(formattedPolls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const getPollByIdDetailed = async (req: any, res: any) => {
    try {
        const pollId = req.params.id;
        const poll = await getPollDetailed(pollId);

        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        // TODO: Find a Solution funtion to format the poll etails
        const formattedPoll = {
            ID: poll.ID,
            Title: poll.Title,
            Description: poll.Description,
            Question: poll.Question,
            CreatedAt: poll.CreatedAt,
            User: poll.User,
            Options: poll.Options.map(option => ({
                ID: option.ID,
                Text: option.Text,
                voteCount: option.Votes.length,
                Voters: option.Votes.map(vote => vote.User),
            })),
        };

        res.status(200).json(formattedPoll);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
