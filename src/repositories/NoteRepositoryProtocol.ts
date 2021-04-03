export interface Note {
  content: string
  lastEdit: string
  createdAt: number
  editedAt: number
  id: string
}

export interface NoteRepositoryProtocol {
  /** Writes a new note for the user */
  write: (content: string) => Promise<Note>

  /** Reads an existing note from the user */
  read: (id: string) => Promise<Note | null>

  /** Reads all existing notes from the user */
  readAll: () => Promise<Note[]>

  /** Deletes an existing note from the user */
  delete: (id: string) => Promise<Note | null>

  /** Deletes all existing notes from the user */
  deleteAll: () => Promise<Note[]>

  edit: (id: string, newContent: string) => Promise<Note> 
}