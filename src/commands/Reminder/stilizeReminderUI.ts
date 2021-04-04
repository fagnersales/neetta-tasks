import { MessageEmbed } from 'discord.js'
import { Page } from 'discord.js-configurator'
import { StilizeData } from 'discord.js-configurator/dist/src/interfaces/Page'

export const stilizeReminderUI = async (page: Page, data?: StilizeData): Promise<MessageEmbed> => {
  const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Trabalhando no seu lembrete...')

  const stringToCodeBlock = (str: string, code: 'diff' | 'js') => {
    return `\`\`\`${code}\n${str}\`\`\``
  }

  embed.setDescription(stringToCodeBlock(page.items.map(item => 
    `${item.isFulfilled ? '+' : '-'} ${item.name}${item.isRequired ? '*' : ''} (${item.instanceOf}) => ${item.value}`
    .trim()).join('\n').trim(), 'diff')
  )

  return embed
}