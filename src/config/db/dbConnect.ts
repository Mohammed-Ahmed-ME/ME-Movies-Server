import prisma from './prismaClient';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Force Google DNS to bypass ISP DNS blocks on MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const Connect = async () => {
    try {
        console.log('🔄 Attempting to connect to Prisma...');
        
        await prisma.$connect();

        console.log('✅ Connected to Database successfully via Prisma');
    } catch (error) {
        console.error('❌ Database connection error:', error);
        throw error;
    }
};

// Graceful shutdown handler
export const closeDatabase = async () => {
    try {
        await prisma.$disconnect();
        console.log('✅ Database connection closed gracefully');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
};

export default Connect;