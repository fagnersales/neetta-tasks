import { MessageEmbed } from 'discord.js'
import { Page } from 'discord.js-configurator'
import ms from 'ms'

export const createConfigPage = (): Page => {
  const configPage = new Page([
    { key: 'what', name: 'Oque', instanceOf: 'text', value: 'Insira o conteúdo deste lembrete' },
    { key: 'at', name: 'tempo', instanceOf: 'text', value: 'Quando o lembrete deve ser ativado?', setter: (value) => {
      const hasSMDChar = /[smd]/.test(value)
      if (!hasSMDChar) return false      
      return !isNaN(ms(value))
      }
    },
    { key: 'repeatDaily', name: 'diariamente', instanceOf: 'S/N', value: 'Você quer que este lembrete repita diariamente?', required: false }
  ], {
    stilize: async () => {
      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Salvando seu novo lembrete...')

      const stringToCodeBlock = (str: string, code: 'diff' | 'js') => {
        return `\`\`\`${code}\n${str}\`\`\``
      }

      embed.setDescription(stringToCodeBlock(configPage.items.map(item => 
        `${item.isFulfilled ? '+' : '-'} ${item.name}${item.isRequired ? '*' : ''} (${item.instanceOf}) => ${item.value}`
        .trim()).join('\n').trim(), 'diff')
      )

      return embed
    }
  })

  return configPage
}