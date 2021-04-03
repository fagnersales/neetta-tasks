import { Message, MessageEmbed, User } from 'discord.js'
import { Page } from 'discord.js-configurator'

export const createConfigPage = (): Page => {
  const configPage = new Page([
    // { key: 'title', name: 'Titulo', instanceOf: 'text', value: 'Insira o título desta anotação' },
    { key: 'content', name: 'Conteúdo', instanceOf: 'text', value: 'Insira o conteúdo desta anotação' }
  ], {
    stilize: async () => {
      const embed = new MessageEmbed()
      
      embed.setColor('RANDOM')
      embed.setTitle('Escrevendo sua nova anotação...')

      const stringToCodeBlock = (str: string, code: 'diff' | 'js') => {
        return `\`\`\`${code}\n${str}\`\`\``
      }

      embed.setDescription(stringToCodeBlock(configPage.items.map(item => 
        `${item.isFulfilled ? '+' : '-'} ${item.name}${item.isRequired ? '*' : ''} => ${item.value}`
        .trim()).join('\n').trim(), 'diff')
      )

      return embed
    }
  })

  return configPage
}