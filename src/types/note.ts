export interface Note{
    id: string,
    title: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    tag: string,
}

// export type NoteID = Note["id"]; tag: "Todo"|"Work"|"Personal"|"Meeting"|"Shopping",