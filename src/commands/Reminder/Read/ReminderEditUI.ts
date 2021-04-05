import { Page } from 'discord.js-configurator'
import ms from 'ms'
import { Reminder } from '../../../repositories/ReminderRepositoryProtocol'
import { stilizeReminderUI } from '../stilizeReminderUI'

import moment from 'moment'
moment.locale('pt-br')

export const createEditPage = ({ what, at }: Reminder): Page => {
  const editPage = new Page([
    { key: 'what', name: 'Oque', instanceOf: 'text', value: what, isRequired: true },
    { key: 'at', name: 'tempo', instanceOf: 'text', value: moment(+at).fromNow(), isRequired: true, setter: (value) => {
      const hasSMDChar = /[smd]/.test(value)
      if (!hasSMDChar) return false      
      return !isNaN(ms(value))
      }
    },
    { key: 'repeatDaily', name: 'diariamente', instanceOf: 'S/N', value: 'Você quer que este lembrete repita diariamente?', isRequired: true }
  ], {
    stilize: (data) => {
      const stilize = stilizeReminderUI(editPage, data)
      return stilize
    }
  })

  return editPage
}