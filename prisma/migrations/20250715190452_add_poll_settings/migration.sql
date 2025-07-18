-- CreateTable
CREATE TABLE "PollSettings" (
    "ID" TEXT NOT NULL,
    "AllowMultipleVotes" BOOLEAN NOT NULL DEFAULT false,
    "CreatedBy" TEXT NOT NULL,
    "ModifiedBy" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ModifiedAt" TIMESTAMP(3) NOT NULL,
    "PollID" TEXT NOT NULL,

    CONSTRAINT "PollSettings_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "PollSettings_PollID_key" ON "PollSettings"("PollID");

-- AddForeignKey
ALTER TABLE "PollSettings" ADD CONSTRAINT "PollSettings_PollID_fkey" FOREIGN KEY ("PollID") REFERENCES "Poll"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
