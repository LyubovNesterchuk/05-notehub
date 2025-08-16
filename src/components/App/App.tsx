import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import css from "./App.module.css";

import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import { fetchNotes, type FetchNotesResponse } from "../../services/noteService";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage: number = 12;

  
  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage, perPage),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        
       
        <SearchBox onChange={updateSearchQuery} />

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

        <Toaster/>

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onSuccess={closeModal} />
          </Modal>
        )}
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {(data?.notes ?? []).length > 0 ? (
        <>
          {data?.totalPages && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}

          {data && <NoteList notes={data.notes} />}

          {console.log(
            "totalPages:",
            data?.totalPages,
            "notes length:",
            data?.notes?.length
          )}
        </>
      ) : (
        !isLoading && !isError && <p>No notes found</p>
      )}
    </div>
  );
}