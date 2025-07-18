
import { castVotes } from '../services/vote.service';
import { getAllPolls, getPollDetailed } from '../services/poll.service';

// import { getPollByIdDetailed, getPolls} from '../controllers/poll.controller';

import { Guard } from '../utils/Guard';

export const vote = async (req: any, res: any) => {
    try {
        const body = req.body;
        const user = req.user as { id: string };
        const io = req.app.get('io'); // Socket.IO instance

        // Validate OptionID
        const result = Guard.againstNullOrUndefinedBulk([
            { argument: body.OptionID, argumentName: 'OptionID' },
        ]);

        if (!result.succeeded) {
            res.status(400).json({
                error: `${result.argumentName} is a required field.`,
            });
            return;
        }

        // Normalize OptionIDs into an array
        const optionIDs = Array.isArray(body.OptionID) ? body.OptionID : [body.OptionID];

        if (optionIDs.some((id: any) => typeof id !== 'string')) {
            res.status(400).json({ error: 'Each OptionID must be a string' });
            return;
        }

        // Call the updated castVotes function
        const { votes, pollId } = await castVotes(user.id, optionIDs);

        // Fetch the updated poll with detailed info
        const updatedPoll = await getPollDetailed(pollId ?? '');
        if (!updatedPoll) {
            res.status(404).json({ error: 'Poll not found' });
            return;
        }

        // Format poll details
        const formattedPoll = {
            ID: updatedPoll.ID,
            Title: updatedPoll.Title,
            Description: updatedPoll.Description,
            Question: updatedPoll.Question,
            CreatedAt: updatedPoll.CreatedAt,
            User: updatedPoll.User,
            Options: updatedPoll.Options.map(option => ({
                ID: option.ID,
                Text: option.Text,
                voteCount: option.Votes.length,
                Voters: option.Votes.map(v => v.User),
            })),
        };

        // Update all clients via Socket.IO
        const updatedPolls = await getAllPolls();
        io.emit('polls:update', updatedPolls);
        io.to(`poll-${pollId}`).emit('poll:update', formattedPoll);

        res.status(201).json(votes);
        return;
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Internal server error' });
        return;
    }
};
