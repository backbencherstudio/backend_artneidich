-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "inspector_id" TEXT NOT NULL,
    "inspector_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "fha_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "standard_fee" TEXT,
    "rush_fee" TEXT,
    "occupied_fee" TEXT,
    "long_range_fee" TEXT,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
