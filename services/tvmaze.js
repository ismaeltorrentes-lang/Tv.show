export const ID = "2993";
export const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

const request = async (URL) => {
  const response = await fetch(URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

export const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const data = await request(URL);
  return {
    name: data.name,
    rating: data.rating,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await request(URL);
  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average
  }));
  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
};

export const searchShowByName = async (name) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`;
  const results = await request(URL);
  return results.map(({ show }) => ({
    id: show.id,
    name: show.name
  }));
};
