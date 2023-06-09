import {
    SlashCommandBuilder,
    CommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('location')
		.setDescription("Set your country and optionally your subdivision/state/region.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'location-country',
                    data: {}
                }))
                .setPlaceholder('Select your country!')
                .addOptions(
                    // @ts-ignore
                    interaction.client.countries.slice(0, 25).map(country => 
                        new StringSelectMenuOptionBuilder()
                            .setLabel(country.name)
                            .setValue(country.name)
                    )
                )
        )

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'location-page',
                    data: { page: 1 }
                }))
        )

        interaction.reply({
            ephemeral: true,
            components: [menuRow, buttonsRow]
        })
	}
}
