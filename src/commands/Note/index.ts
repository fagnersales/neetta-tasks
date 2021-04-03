import { noteReadCommand } from './Read'
import { noteReadAllCommand } from './ReadAll'
import { noteWriteCommand } from './Write'

export const commands = {
  write: noteWriteCommand,
  read: noteReadCommand,
  readAll: noteReadAllCommand
}