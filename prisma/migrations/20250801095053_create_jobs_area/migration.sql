-- AlterTable
ALTER TABLE "job_images" ADD COLUMN     "area_id" TEXT;

-- CreateTable
CREATE TABLE "job_areas" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_areas_job_id_idx" ON "job_areas"("job_id");

-- AddForeignKey
ALTER TABLE "job_areas" ADD CONSTRAINT "job_areas_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_images" ADD CONSTRAINT "job_images_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "job_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
