export function aplicarMarkup(precioBase, porcentaje) {
  const base = Number(precioBase);
  const pct = Number(porcentaje) || 0;
  return Math.round(base * (1 + pct / 100));
}

export function tituloCapitalizado(texto) {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}
