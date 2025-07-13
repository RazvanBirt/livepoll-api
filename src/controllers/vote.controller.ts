
import { castVote } from '../services/vote.service';
import { getAllPolls, getPollDetailed } from '../services/poll.service';

// import { getPollByIdDetailed, getPolls} from '../controllers/poll.controller';

import { Guard } from '../utils/Guard';

export const vote = async (req: any, res: any) => {
    try {
        const body = req.body;

        const user = req.user as { id: string };

        const io = req.app.get('io'); // 👈 access Socket.IO instance

        const result = Guard.againstNullOrUndefinedBulk([
            { argument: body.OptionID, argumentName: 'OptionID' },
        ]);

        if (!result.succeeded) {
            res.status(400).json({
                error: `${result.argumentName} is a required field.`,
            });
            return;
        }

        if (!body.OptionID || typeof body.OptionID !== 'string') {
            res.status(400).json({ error: 'OptionID is required and must be a string' });
            return;
        }

        const { vote, pollId } = await castVote(user.id, body.OptionID);

        const updatedPoll = await getPollDetailed(pollId ?? '');

        // TODO: Find a Solution funtion to format the poll details
        const formattedPoll = {
            ID: updatedPoll?.ID,
            Title: updatedPoll?.Title,
            Description: updatedPoll?.Description,
            Question: updatedPoll?.Question,
            CreatedAt: updatedPoll?.CreatedAt,
            User: updatedPoll?.User,
            Options: updatedPoll?.Options.map(option => ({
                ID: option.ID,
                Text: option.Text,
                voteCount: option.Votes.length,
                Voters: option.Votes.map(vote => vote.User),
            })),
        };


        const updatedPolls = await getAllPolls();

        io.emit('polls:update', updatedPolls);

        io.to(`poll-${pollId}`).emit('poll:update', formattedPoll);

        res.status(201).json(vote);
        return;
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
