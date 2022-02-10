/*
  Warnings:

  - You are about to drop the column `activation_code` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PasswordRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resetKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "activationCode" INTEGER NOT NULL DEFAULT 111066,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("active", "createdAt", "dob", "email", "firstName", "id", "lastName", "password", "updatedAt") SELECT "active", "createdAt", "dob", "email", "firstName", "id", "lastName", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
