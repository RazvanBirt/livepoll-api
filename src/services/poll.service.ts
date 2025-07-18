import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPoll = async (
    title: string,
    description: string,
    question: string,
    options: string[],
    userId: string,
    settings: { AllowMultipleVotes: boolean }
) => {
    return await prisma.poll.create({
        data: {
            Title: title,
            Description: description,
            Question: question,
            CreatedBy: userId,
            ModifiedBy: userId,
            UserID: userId,
            Options: {
                create: options.map((optionText) => ({
                    Text: optionText,
                    CreatedBy: userId,
                    ModifiedBy: userId,
                })),
            },
            Settings: {
                create: {
                    AllowMultipleVotes: settings?.AllowMultipleVotes ?? false,
                    CreatedBy: userId,
                    ModifiedBy: userId,
                },
            },
        },
        include: {
            Options: true,
            Settings: true,
        },
    });
};

export const getAllPolls = async () => {
    return await prisma.poll.findMany({
        include: {
            Options: {
                include: {
                    Votes: {
                        select: {
                            ID: true,
                            User: {
                                select: {
                                    ID: true,
                                    UserName: true,
                                    Email: true,
                                },
                            },
                        },
                    },
                },
            },
            User: {
                select: {
                    ID: true,
                    UserName: true,
                    Email: true,
                },
            },
        },
        orderBy: {
            CreatedAt: 'desc',
        },
    });
};

export const getPollDetailed = async (id: string) => {
    return await prisma.poll.findUnique({
        where: { ID: id },
        include: {
            Options: {
                include: {
                    Votes: {
                        select: {
                            ID: true,
                            User: {
                                select: {
                                    ID: true,
                                    UserName: true,
                                    Email: true,
                                },
                            },
                        },
                    },
                },
            },
            User: {
                select: {
                    ID: true,
                    UserName: true,
                    Email: true,
                },
            },
        }
    });
};
