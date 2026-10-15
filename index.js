import { ID, PLACEHOLDER_IMAGE, getShowData, getEpisodeList, searchShowByName } from "./services/tvmaze.js";

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $search = document.querySelector(".search");

const pad = (value) => String(value).padStart(2, "0");
const clampRating = (rating) => Math.min(10, Math.max(0, Math.round(rating ?? 0)));
const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const createEpisodeHTML = (episode) => {
  const rating = clampRating(episode.rating);
  const label = `T${pad(episode.season)}E${pad(episode.number)} · ${episode.rating ?? "sin valoración"}`;
  return `<div class="episode episode-${pad(episode.number)} rating-${rating}" title="${label}">${pad(episode.number)}</div>`;
};

const createSeasonHTML = (data, number) => `
  <article class="season">
    <header class="season-header">T${pad(number)}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>`;

const createShowHTML = ({ name, rating, image }) => `
  <img class="poster" src="${image ?? PLACEHOLDER_IMAGE}" alt="Póster de ${escapeHTML(name)}">
  <div class="show-info">
    <h1>${escapeHTML(name)}</h1>
    <p class="score">★ ${rating?.average ?? "sin valoración"}</p>
  </div>`;

const renderShow = async (id) => {
  $episodes.setHTMLUnsafe(`<p class="status">Cargando...</p>`);
  try {
    const [show, seasons] = await Promise.all([getShowData(id), getEpisodeList(id)]);
    $header.setHTMLUnsafe(createShowHTML(show));
    const list = Object.values(seasons).map((season, index) => createSeasonHTML(season, index + 1));
    $episodes.setHTMLUnsafe(list.join(""));
    document.title = `${show.name} · TV Show`;
  }
  catch (error) {
    $episodes.setHTMLUnsafe(`<p class="status error">No se pudo cargar la serie (${escapeHTML(error.message)})</p>`);
  }
};

const searchShow = async (query) => {
  if (/^\d+$/.test(query)) {
    history.replaceState(null, "", `?id=${query}`);
    await renderShow(query);
    return;
  }
  $episodes.setHTMLUnsafe(`<p class="status">Buscando "${escapeHTML(query)}"...</p>`);
  try {
    const results = await searchShowByName(query);
    if (results.length === 0) {
      $episodes.setHTMLUnsafe(`<p class="status error">No se encontraron series para "${escapeHTML(query)}"</p>`);
      return;
    }
    const [first] = results;
    history.replaceState(null, "", `?id=${first.id}`);
    await renderShow(first.id);
  }
  catch (error) {
    $episodes.setHTMLUnsafe(`<p class="status error">Error en la búsqueda (${escapeHTML(error.message)})</p>`);
  }
};

$search.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = new FormData($search).get("q")?.trim();
  if (query) searchShow(query);
});

const initialId = new URLSearchParams(location.search).get("id") ?? ID;
await renderShow(initialId);
