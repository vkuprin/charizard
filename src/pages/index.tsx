import {
  dehydrate,
  QueryClient,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type GetStaticProps } from "next";
import { useRouter } from "next/router";
import {
  type ChangeEvent,
  type ReactElement,
  useEffect,
  useState,
} from "react";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonResponse = {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
};

const fetchPokemon = async (
  page = 0,
  limit,
  searchTerm = ""
): Promise<PokemonResponse> => {
  const offset = page * limit;
  const search = searchTerm ? `/${searchTerm}?` : "?";

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon${search}offset=${offset}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["pokemon"], fetchPokemon);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const PokemonList = (): ReactElement => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const query: UseQueryResult<PokemonResponse> = useQuery(
    ["pokemon", page, itemsPerPage, debouncedSearchTerm],
    () => fetchPokemon(page, itemsPerPage, debouncedSearchTerm),
    {
      retry: false,
    }
  );

  const totalPages = query.data
    ? Math.ceil(query.data.count / itemsPerPage)
    : 0;

  const router = useRouter();

  const handleClick = (pokemon: Pokemon) => {
    void router.push(`/pokemon/${pokemon.name}`);
  };

  const handlePageChange = (step: number) => {
    setPage((old) => Math.max(old + step, 0));
  };

  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
  };

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1 style={{ marginTop: -20, marginBottom: 20 }}>Pokemon List</h1>
      <div>
        Page {page + 1} of {totalPages}
      </div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Search Pokemon precisely by name"
          style={{ width: 300 }}
        />
      </div>
      <div className="pokemon-list">
        {query.isLoading && <div>Loading...</div>}
        {query.isError && <div>Error: {query.error.message}</div>}
        {Array.isArray(query.data?.results)
          ? query.data?.results.map((pokemon) => (
              <div
                key={pokemon.name}
                className="pokemon-item"
                onClick={() => handleClick(pokemon)}
              >
                {pokemon.name}
              </div>
            ))
          : query.data && (
              <div
                className="pokemon-item"
                onClick={() => handleClick(query.data as Pokemon)}
              >
                {(query.data as Pokemon).name}
              </div>
            )}
      </div>
      <div>
        <button
          disabled={page === 0}
          onClick={() => handlePageChange(-1)}
          className="pokemon-item"
        >
          Previous Page
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => handlePageChange(1)}
          className="pokemon-item"
        >
          Next Page
        </button>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="pokemon-item"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default PokemonList;
