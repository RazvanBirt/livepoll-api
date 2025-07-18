// src/services/vote.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const castVote = async (UserID: string, OptionID: string) => {
    const option = await prisma.pollOption.findUnique({
        where: { ID: OptionID },
        include: {
            Poll: {
                include: {
                    Settings: true,
                },
            },
        },
    });

    if (!option) {
        throw new Error('Option does not exist');
    }

    const pollId = option.PollID;
    const allowMultipleVotes = option.Poll.Settings?.AllowMultipleVotes ?? false;

    if (!allowMultipleVotes) {
        const existingVote = await prisma.vote.findFirst({
            where: {
                UserID: UserID,
                Option: {
                    PollID: pollId,
                },
            },
        });

        if (existingVote) {
            throw new Error('User has already voted in this poll');
        }
    }

    const vote = await prisma.vote.create({
        data: {
            OptionID: OptionID,
            UserID: UserID,
            CreatedBy: UserID,
            ModifiedBy: UserID,
        },
        include: {
            Option: { select: { PollID: true } },
        },
    });

    return { vote, pollId };
};

