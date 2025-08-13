import { useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const handleSearch = (newNote: string) => {
    setSearchQuery(newNote);
    setCurrentPage(1);
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedSearchQuery, currentPage],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage, perPage),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearch} />

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

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
        
        {data?.totalPages && data.totalPages > 1 &&  (
            <Pagination
              pageCount={data.totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}

        <NoteList notes={data!.notes} />

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