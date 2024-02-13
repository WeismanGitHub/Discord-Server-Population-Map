import { InfoEmbed } from '../../utils/embeds';
import config from '../../config';
import { resolve } from 'path';
import {
    SlashCommandBuilder,
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('help').setDescription('Information about this bot.'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        const attachment = new AttachmentBuilder(resolve(__dirname, '../../../../images/WORLD2-example.jpg'), {
            name: 'world-example.jpg',
        });

        const embed = new InfoEmbed(
            null,
            'The Population Map Bot is a dynamic map generator capable of visualizing population data on a global, continental, or country level. Maps are generated from self-reported locations provided by Discord server members, enabling users to explore population distributions with ease.\n\nThis bot generates a unique map for each Discord server that can be accessed with `/map`. Server members use `/set-location` to add their location to the map. Locations can be any country and, optionally, a subdivision (state, region, prefecture, etc.) within that country. Server admins can also make it so only members who share their location can access the server.'
        )
            .addFields({ name: 'Contact the Creator:', value: `<@${config.mainAccountID}>` })
            .setImage('attachment://world-example.jpg');

        const linksRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder().setLabel('Website').setURL(config.websiteURL).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('GitHub').setURL(config.githubURL).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('Server').setURL(config.supportServerInvite).setStyle(ButtonStyle.Link),
            // 	new ButtonBuilder()
            // 	.setLabel('Buy Me a Coffee')
            // 	.setURL(config.buyMeACoffeeURL)
            // 	.setStyle(ButtonStyle.Link),
        ]);

        const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('User Docs')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'help-users',
                        data: {},
                    })
                ),
            new ButtonBuilder()
                .setLabel('Server Owner Docs')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'help-owners',
                        data: {},
                    })
                )
        );

        const mapButtonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('World Map')
                .setStyle(ButtonStyle.Link)
                .setURL(`${config.websiteURL}/maps/${interaction.guildId}?mapCode=WORLD`),
            new ButtonBuilder()
                .setLabel('Continents Map')
                .setStyle(ButtonStyle.Link)
                .setURL(`${config.websiteURL}/maps/${interaction.guildId}?mapCode=CONTINENTS`)
        );

        await interaction.reply({
            embeds: [embed],
            components: interaction.guild ? [firstRow, linksRow, mapButtonsRow] : [firstRow, linksRow],
            ephemeral: true,
            files: [attachment],
        });
    },
};
