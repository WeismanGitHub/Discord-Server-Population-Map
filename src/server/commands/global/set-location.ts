import { NotFoundError } from '../../errors';
import alphabet from '../../utils/letters';
import { Guild } from '../../db/models';
import {
    SlashCommandBuilder,
    CommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} from 'discord.js';
import { InfoEmbed } from '../../utils/embeds';

export default {
    data: new SlashCommandBuilder()
        .setName('set-location')
        .setDMPermission(false)
        .setDescription('Set your country and optionally your subdivision (state, region, prefecture, etc).'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        const guild = await Guild.findOne({ where: { guildID: interaction.guildId! } });

        if (!guild) {
            throw new NotFoundError("This server hasn't been set up.");
        }

        const lettersRow1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        // customId needs to be unique so I added x: 0
                        data: { commandType: 'location-country', x: 0 },
                    })
                )
                .setPlaceholder('A - L')
                .addOptions(
                    alphabet
                        .slice(0, 13)
                        .map((letter) =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(letter)
                                .setValue(letter)
                        )
                )
        );

        const lettersRow2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        // customId needs to be unique so I added x: 1
                        data: { commandType: 'location-country', x: 1 },
                    })
                )
                .setPlaceholder('M - Z')
                .addOptions(
                    alphabet
                        .slice(13)
                        .map((letter) =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(letter)
                                .setValue(letter)
                        )
                )
        );

        await interaction.reply({
            ephemeral: true,
            embeds: [new InfoEmbed('What letter does your country start with?')],
            components: [lettersRow1, lettersRow2],
        });
    },
};
