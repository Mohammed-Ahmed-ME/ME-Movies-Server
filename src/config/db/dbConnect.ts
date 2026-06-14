import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Force Google DNS to bypass ISP DNS blocks on MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const Connect = async () => {
    try {
        const mongoUri =  process.env.MONGODB_URL_ATLAS;
        if (!mongoUri) {
            throw new Error('MONGODB_URL environment variable is not defined');
        }

        console.log('🔄 Attempting to connect to MongoDB...');

        const options: mongoose.ConnectOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        mongoose.set('bufferCommands', false);
        mongoose.set('strictQuery', true);

        await mongoose.connect(mongoUri, options);

        console.log('✅ Connected to MongoDB successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        console.log(`🌐 Port: ${mongoose.connection.port}`);

    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // رسالة مساعدة
        if (error instanceof Error && error.message.includes('IP')) {
            console.error('📌 Quick Fix:');
            console.error('1. Go to: https://cloud.mongodb.com/');
            console.error('2. Navigate to: Security → Network Access');
            console.error('3. Click: Add IP Address');
            console.error('4. Add your current IP or 0.0.0.0/0 (for development only)');
            console.error('\n💡 Your current IP might be visible at: https://api.ipify.org\n');
        }

        throw error;
    }
};
// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📡 Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose reconnected to MongoDB');
});

// Graceful shutdown handler
export const closeDatabase = async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed gracefully');
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        throw error;
    }
};

export default Connect;