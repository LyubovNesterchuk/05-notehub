import axios from "axios";
import type { Note, NoteID } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
};

// Тип відповіді API згідно документації
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  page = 1,
  perPage = 12
): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    ...config,
    params: { search, page, perPage },
  });
  return response.data;
}

export const createNote = async (
  newNote: Pick<Note, "title" | "content" | "tag">
) => {
  const response = await axios.post<Note>("/notes", newNote, config);
  return response.data;
};

export const deleteNote = async (noteId: NoteID) => {
  const response = await axios.delete<Note>(`/notes/${noteId}`, config);
  return response.data;
};