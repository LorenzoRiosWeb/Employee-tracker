const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

async function connectToDatabase() { // Mark the function as async
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.log('error connecting to the database:', error);
        // You might want to throw the error to handle it elsewhere
        throw error;
    }
}

