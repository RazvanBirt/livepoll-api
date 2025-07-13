-- CreateTable
CREATE TABLE "User" (
    "ID" TEXT NOT NULL,
    "UserName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreatedBy" TEXT NOT NULL,
    "ModifiedBy" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ModifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Poll" (
    "ID" TEXT NOT NULL,
    "Question" TEXT NOT NULL,
    "CreatedBy" TEXT NOT NULL,
    "ModifiedBy" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ModifiedAt" TIMESTAMP(3) NOT NULL,
    "UserID" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "ID" TEXT NOT NULL,
    "Text" TEXT NOT NULL,
    "CreatedBy" TEXT NOT NULL,
    "ModifiedBy" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ModifiedAt" TIMESTAMP(3) NOT NULL,
    "PollID" TEXT NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Vote" (
    "ID" TEXT NOT NULL,
    "CreatedBy" TEXT NOT NULL,
    "ModifiedBy" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ModifiedAt" TIMESTAMP(3) NOT NULL,
    "OptionID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_PollID_fkey" FOREIGN KEY ("PollID") REFERENCES "Poll"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_OptionID_fkey" FOREIGN KEY ("OptionID") REFERENCES "PollOption"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
