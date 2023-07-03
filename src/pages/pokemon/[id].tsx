import { type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
};

const fetchPokemonDetail = async (name: string): Promise<PokemonDetail> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const json: unknown = await res.json();
  return json as PokemonDetail;
};

const PokemonDetail = (): ReactElement => {
  const router = useRouter();

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useQuery<PokemonDetail, Error>(
    ["pokemon", router.query.id],
    () => fetchPokemonDetail(router.query.id as string),
    {
      enabled: !!router.query.id,
    }
  );

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {"message" in error ? error.message : "Something went wrong"}
      </div>
    );
  }

  return (
    <div>
      <h1>Pokemon Details</h1>
      <span onClick={goBack} style={{ cursor: "pointer" }}>
        Back
      </span>
      {pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <p>Type: {pokemon.types.map((t) => t?.type.name).join(", ")}</p>
          <p>
            Abilities: {pokemon.abilities.map((a) => a.ability.name).join(", ")}
          </p>
          <p>
            Some Moves:{" "}
            {pokemon.moves
              .slice(0, 5)
              .map((m) => m.move.name)
              .join(", ")}
          </p>
          <div>
            <h3>Stats:</h3>
            {pokemon.stats.map((s) => (
              <p key={s.stat.name}>
                {s.stat.name}: {s.base_stat}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div>No Pokemon selected</div>
      )}
    </div>
  );
};

export default PokemonDetail;
