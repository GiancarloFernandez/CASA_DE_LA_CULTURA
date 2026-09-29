function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
    const row = {};
    headers.forEach((h, i) => row[h] = cells[i] || "");
    return row;
  });
}

async function fetchCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("respuesta no válida");
  return parseCSV(await res.text());
}

function driveFileId(url) {
  if (!url) return null;
  const m1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  return null;
}

// Convierte un link normal de "Compartir" de Google Drive en un link
// estable para usar en <img src="...">. Usamos el servicio de miniaturas
// de Drive porque es mucho más confiable para insertar en sitios web
// que el formato uc?export=view (que a veces se bloquea).
function driveImageUrl(url) {
  if (!url) return url;
  if (!url.includes("drive.google.com")) return url;
  const id = driveFileId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : url;
}

// Convierte un link normal de "Compartir" de Google Drive en un link
// de descarga directa (para PDFs de catálogos)
function driveDownloadUrl(url) {
  if (!url) return url;
  if (!url.includes("drive.google.com")) return url;
  const id = driveFileId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}
