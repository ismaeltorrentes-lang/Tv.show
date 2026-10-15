# TV Show · TVMaze

Aplicación web que muestra información de una serie y sus episodios agrupados por temporada usando la [API de TVMaze](https://www.tvmaze.com/api).

## Estructura

```
tv-shows/
  src/
    index.html         # HTML principal
    index.css          # CSS global
    index.js           # Javascript principal (renderizado del DOM)
    services/tvmaze.js # Conexión con la API (getShowData, getEpisodeList, searchShowByName)
  package.json
  README.md
```

## Ejecución

Los módulos ES y el `fetch` necesitan un servidor HTTP (no sirve abrir el archivo con `file://`):

```bash
npm run dev            # npx serve src -l 3000
# o alternativa sin Node:
python3 -m http.server 3000 --directory src
```

Luego abre <http://localhost:3000>.

## Funcionalidad

- Carga la serie por defecto con `ID = "2993"` (Stranger Things).
- Busca por nombre (`/search/shows?q=`) o directamente por ID numérico (ej. `169` → Breaking Bad).
- Muestra póster, nombre y valoración global (`/shows/:id`).
- Pinta cada temporada con sus episodios coloreados según su valoración (`/shows/:id/episodes`).
- El parámetro `?id=` de la URL permite compartir una serie concreta.
