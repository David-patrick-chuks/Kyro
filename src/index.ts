import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import helmet from 'helmet'

// Custom imports
import { corsOptions } from './config/cors'
import './config/passport'; // Passport configuration
import { catchAll404Request } from './utils/catchAll404Request'
import { globalError } from './utils/globalErrorHandler'
import { fullServerStatus, serverUpTime } from './utils/serverUptime'
import connectDB from './config/db'
import { MorganSetup } from './config/morganSetup'
import { healthcareService_DataBase } from './scripts/HealthCheckController'

// Initialize environment variables
dotenv.config()

const app: Application = express()

// Connect to the database
connectDB()

// Middleware setup
app.use(helmet({ xssFilter: true, noSniff: true })) // Security headers
app.use(express.json()) // JSON body parsing
app.use(express.urlencoded({ extended: true, limit: '1kb' })) // URL-encoded data
app.use(cookieParser()) // Cookie parsing

// Stream Morgan logs to Winston
app.use(MorganSetup)

// CORS middleware
app.use(cors(corsOptions))

// Health check route
app.get('/healthz', fullServerStatus)
app.get('/health', healthcareService_DataBase)

// Uptime API endpoint
app.get('/uptime', serverUpTime)

// Catch-all 404 handler for undefined routes
app.use(catchAll404Request)


// Global error handler
app.use(globalError)

export default app
