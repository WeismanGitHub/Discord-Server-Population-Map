import { InternalServerError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import { AppLog } from './db/models/logs/'
import sequelize from './db/sequelize'
require('express-async-errors')
import config from './config'
import app from './app'

(async function() {
	const client = new CustomClient({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	});

	app.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));
	app.set('discordClient', client);
	
	await sequelize.authenticate()
	.catch((err) => { throw new InternalServerError('Could not connect to database.') })

	console.log('connected to database...')
	
	return (await client.guilds.fetch()).size
})().then(guildsAmount => {
	AppLog.log({
		level: 'info',
		guildsAmount
	})
}).catch((err: Error) => {
	AppLog.log({
		level: 'error',
		description: err.message,
	})
})