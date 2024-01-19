import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../errors';
import { infoEmbed } from '../../utils/embeds';
import { User } from '../../db/models';
import config from '../../config';

export default {
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('[Bot Owner Only] Promote a user.')
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('user-id')
                .setDescription('The user ID of whoever you want to promote.')
                .setRequired(true)
        ),
    guildIDs: [config.supportServerID, ...config.personalServerIDs],
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.client.application.fetch();

        if (interaction.user.id !== interaction.client.application.owner?.id) {
            throw new ForbiddenError('You are not the bot owner.');
        }

        const user = await User.findOne({ where: { userID: interaction.options.getString('user-id')! } });

        if (!user) {
            throw new NotFoundError('User is not in the database.');
        }

        if (user.role === 'admin') {
            throw new ConflictError('They are already a regular user.');
        }

        await user.update({ role: 'admin' });

        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Promoted the user.')],
        });
    },
};
