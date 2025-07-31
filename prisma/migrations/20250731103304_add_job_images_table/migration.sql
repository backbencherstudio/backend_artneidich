-- CreateTable
CREATE TABLE "job_images" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_images" ADD CONSTRAINT "job_images_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
