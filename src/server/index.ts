import { InternalServerError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import sequelize from './db/sequelize';
require('express-async-errors');
import config from './config';
import api from './api';

(async function () {
    for (const entry of Object.entries(config)) {
        const [key, value] = entry;

        if (Number.isNaN(value) || value === undefined) {
            throw new InternalServerError(`${key} is missing.`);
        }
    }

    if (!['prod', 'dev'].includes(config.mode)) {
        throw new InternalServerError('Mode must be equal to "prod" or "dev".');
    }

    await sequelize.authenticate().catch(() => {
        throw new InternalServerError('Could not connect to database.');
    });

    const client = new CustomClient({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    api.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));
    api.set('discordClient', client);

    console.log('connected to database...');
})();
