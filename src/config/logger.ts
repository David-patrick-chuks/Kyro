import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'
import fs from 'fs'

// Ensure the logs directory exists
const logDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true })
}

// Define log levels and their corresponding colors
const logLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		debug: 3,
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'blue',
	},
}
// Custom function to format the timestamp
const customTimestamp = () => {
	const now = new Date()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	const seconds = now.getSeconds()
	const ampm = hours >= 12 ? 'PM' : 'AM'
	const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${ampm}`
	return formattedTime
}

const logger = createLogger({
	levels: logLevels.levels,
	format: format.combine(
		format.timestamp({ format: customTimestamp }),
		format.colorize(),
		format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}]: ${message}`
		})
	),
	transports: [
		new transports.Console({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			format: format.combine(format.colorize(), format.simple()),
		}),
		new transports.DailyRotateFile({
			filename: 'logs/%DATE%-combined.log',
			datePattern: 'YYYY-MM-DD',
			level: 'info',
			maxFiles: '14d', // Keep logs for the last 14 days
			maxSize: '20m', // Maximum log file size before rotation (20MB)
			zippedArchive: true, // Compress old log files
			format: format.combine(format.timestamp(), format.json()),
		}), // Daily rotating log file for general info
		new transports.DailyRotateFile({
			filename: 'logs/%DATE%-error.log',
			datePattern: 'YYYY-MM-DD',
			level: 'error',
			maxFiles: '14d', // Keep logs for the last 14 days
			maxSize: '20m', // Maximum log file size before rotation (20MB)
			zippedArchive: true, // Compress old log files
			format: format.combine(format.timestamp(), format.json()),
		}), // Daily rotating error log
		new transports.DailyRotateFile({
			filename: 'logs/%DATE%-debug.log',
			datePattern: 'YYYY-MM-DD',
			level: 'debug',
			maxFiles: '14d', // Keep logs for the last 14 days
			maxSize: '20m', // Maximum log file size before rotation (20MB)
			zippedArchive: true, // Compress old log files
			format: format.combine(format.timestamp(), format.json()),
		}), // Daily rotating debug log
	],
})

// Catch unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
	logger.error(`Unhandled Rejection: ${error.message || error}`)
	process.exit(1)
})

// Catch uncaught exceptions
process.on('uncaughtException', (error: Error) => {
	logger.error(`Uncaught Exception: ${error.message || error}`)
	process.exit(1)
})

process.on('warning', (warning: Error) => {
	logger.warn(`Warning: ${warning.message || warning}`)
})

export default logger
