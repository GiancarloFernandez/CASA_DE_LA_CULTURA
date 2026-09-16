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
