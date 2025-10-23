import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();


// creates a sql connection using the db url from the .env file
export const sql = neon(process.env.DATABASE_URL);