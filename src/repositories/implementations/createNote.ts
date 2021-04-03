import { User } from 'discord.js'
import { Note } from '../NoteRepositoryProtocol'

export const createNote = (content: string, id: string): Note => {
  const resolvedContent = content.trim()

  return {
    content: resolvedContent,
    lastEdit: resolvedContent,
    createdAt: Date.now(),
    editedAt: Date.now(),
    id
  }
}