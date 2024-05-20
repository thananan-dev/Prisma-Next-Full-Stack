import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const db = {
  CheckDatabaseConnection: async () => {
    try {
      await prisma.$connect();
      await prisma.$disconnect();
      console.log("Database connected");
    } catch (error) {
      await prisma.$disconnect();
      console.log("Can't connect to the database");
    }
  },
};

export default db;
