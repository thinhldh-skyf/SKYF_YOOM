-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "tutorEmail" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);
