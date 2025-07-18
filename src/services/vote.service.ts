// src/services/vote.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const castVotes = async (UserID: string, OptionIDs: string[]) => {
    if (!OptionIDs || OptionIDs.length === 0) {
        throw new Error('No options selected');
    }

    // Fetch all options
    const options = await prisma.pollOption.findMany({
        where: { ID: { in: OptionIDs } },
        include: {
            Poll: { include: { Settings: true } },
        },
    });

    if (options.length !== OptionIDs.length) {
        throw new Error('Some options do not exist');
    }

    // Ensure all options belong to the same poll
    const pollId = options[0].PollID;
    if (options.some(option => option.PollID !== pollId)) {
        throw new Error('All selected options must belong to the same poll');
    }

    const allowMultipleVotes = options[0].Poll.Settings?.AllowMultipleVotes ?? false;

    if (!allowMultipleVotes) {
        // Only one vote allowed in the poll
        const existingVote = await prisma.vote.findFirst({
            where: {
                UserID: UserID,
                Option: { PollID: pollId },
            },
        });
        if (existingVote) {
            throw new Error('User has already voted in this poll');
        }
    } else {
        // For multiple votes, ensure user hasn't voted for the same option already
        const existingVotes = await prisma.vote.findMany({
            where: {
                UserID: UserID,
                OptionID: { in: OptionIDs },
            },
        });

        if (existingVotes.length > 0) {
            const alreadyVotedOptions = existingVotes.map(v => v.OptionID);
            throw new Error(`User has already voted for options: ${alreadyVotedOptions.join(', ')}`);
        }
    }

    // Create votes
    const votes = await prisma.$transaction(
        OptionIDs.map((OptionID) =>
            prisma.vote.create({
                data: {
                    OptionID,
                    UserID,
                    CreatedBy: UserID,
                    ModifiedBy: UserID,
                },
            })
        )
    );

    return { votes, pollId };
};

