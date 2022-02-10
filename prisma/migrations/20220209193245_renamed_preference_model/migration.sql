/*
  Warnings:

  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PreferenceToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Preference";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PreferenceToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ShoppingPreference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShoppingPreferenceToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "ShoppingPreference" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingPreference_name_key" ON "ShoppingPreference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingPreferenceToUser_AB_unique" ON "_ShoppingPreferenceToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingPreferenceToUser_B_index" ON "_ShoppingPreferenceToUser"("B");
