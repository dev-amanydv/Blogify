-- CreateTable
CREATE TABLE "draftBlogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "draftCreatedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draftBlogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "draftBlogs" ADD CONSTRAINT "draftBlogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
