import { User } from 'discord.js'
import { Note, NoteRepositoryProtocol } from '../NoteRepositoryProtocol'
import { createNote } from './createNote'

import { database } from '../../firebase'

export class NoteRepository implements NoteRepositoryProtocol {
  private noteReference = (user: User, id: string) => database.ref(`notes/${user.id}/${id}/`)
  private notesReference = (user: User) => database.ref(`notes/${user}`)

  private constructor(private user: User) {}

  async write(content: string, inferID?: string): Promise<Note> {
    const id = inferID ?? String(Math.floor(Math.random() * 250))

    const note = createNote(content, id)

    await this.noteReference(this.user, id).set(note)

    return note

  }

  async read(id: string): Promise<Note | null> {
    const note = (await this.noteReference(this.user, id).get()).val()

    return note ?? null
  }

  async readAll(): Promise<Note[]> {
    const notesObject = (await this.notesReference(this.user).get()).val()

    if (!notesObject) return []

    return Object.values(notesObject) 
  }

  async delete (id: string): Promise<Note | null> {
    const note = await this.read(id)

    await this.noteReference(this.user, id).set(null)

    return note
  }

  async deleteAll(): Promise<Note[]> {
    const notes = await this.readAll()

    await this.notesReference(this.user).set(null)

    return notes
  } 

  async edit (id: string, newContent: string): Promise<Note> {
    const note = await this.write(newContent, id)

    return note ?? null
  }

  static create(user: User) {
    return new NoteRepository(user)
  }
}