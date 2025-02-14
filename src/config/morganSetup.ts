import morgan from 'morgan'
import logger from './logger'

export const MorganSetup = morgan('combined', {
	stream: {
		write: (message: string) => logger.info(message.trim()), // Stream Morgan logs to Winston
	},
})
