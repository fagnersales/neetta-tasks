import { Page } from 'discord.js-configurator'
import ms from 'ms'
import { stilizeReminderUI } from '../stilizeReminderUI'

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
    stilize: (data) => {
      const stilize = stilizeReminderUI(configPage, data)
      return stilize
    }
  })

  return configPage
}