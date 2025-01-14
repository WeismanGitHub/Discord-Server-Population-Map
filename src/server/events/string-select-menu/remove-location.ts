import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    StringSelectMenuInteraction,
    Interaction,
    EmbedBuilder,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId);

        if (customID.type !== 'remove-location') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{}>;
    }) => {
        const guildID = interaction.values[0];

        const guild = await interaction.client.guilds.fetch(guildID);

        const confirmationButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel(`Remove Location?`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'remove-location-confirmation',
                        data: { guildID },
                    })
                )
        );

        const guildEmbed = new EmbedBuilder()
            .setTitle(guild.name)
            .setColor('#2d7dbc') // Blue
            .setImage(guild.iconURL())
            .setFooter({ text: `ID: ${guildID}` });

        await interaction.update({
            embeds: [guildEmbed],
            components: [confirmationButtonRow],
        });
    },
};
