import type { ContentItem } from "@/types/game";

export type WordCard = ContentItem & {
  word: string;
  /** The words that would make it too easy. Saying one costs the card. */
  forbidden: readonly string[];
};

/** New entries go at the end, so existing ids keep their meaning in stored games. */
const DRAFTS: readonly (readonly [string, readonly string[]])[] = [
  ["Playa", ["Arena", "Mar", "Sol", "Vacaciones"]],
  ["Mate", ["Yerba", "Bombilla", "Termo", "Cebar"]],
  ["Asado", ["Carne", "Parrilla", "Domingo", "Chorizo"]],
  ["Fútbol", ["Pelota", "Gol", "Arco", "Messi"]],
  ["Dentista", ["Dientes", "Muela", "Boca", "Doctor"]],
  ["Cumpleaños", ["Torta", "Velas", "Regalo", "Años"]],
  ["Colectivo", ["Bondi", "Parada", "Viaje", "Chofer"]],
  ["Pizza", ["Muzzarella", "Horno", "Porción", "Italia"]],
  ["Lluvia", ["Agua", "Paraguas", "Nube", "Mojado"]],
  ["Celular", ["Teléfono", "Llamar", "Pantalla", "Mensaje"]],
  ["Navidad", ["Árbol", "Papá Noel", "Regalos", "Diciembre"]],
  ["Perro", ["Ladrar", "Mascota", "Hueso", "Cachorro"]],
  ["Avión", ["Volar", "Aeropuerto", "Piloto", "Alas"]],
  ["Hospital", ["Médico", "Enfermo", "Camilla", "Ambulancia"]],
  ["Escuela", ["Maestra", "Alumno", "Aula", "Recreo"]],
  ["Helado", ["Frío", "Cucurucho", "Gusto", "Verano"]],
  ["Guitarra", ["Cuerdas", "Tocar", "Música", "Instrumento"]],
  ["Supermercado", ["Comprar", "Changuito", "Caja", "Góndola"]],
  ["Bicicleta", ["Pedalear", "Ruedas", "Manubrio", "Casco"]],
  ["Cine", ["Película", "Pochoclo", "Pantalla", "Butaca"]],
  ["Gato", ["Maullar", "Mascota", "Bigotes", "Ratón"]],
  ["Casamiento", ["Boda", "Novia", "Anillo", "Fiesta"]],
  ["Café", ["Taza", "Negro", "Leche", "Desayuno"]],
  ["Montaña", ["Alta", "Nieve", "Escalar", "Cerro"]],
  ["Peluquería", ["Pelo", "Cortar", "Tijera", "Peinado"]],
  ["Empanada", ["Masa", "Relleno", "Horno", "Carne"]],
  ["Vacaciones", ["Viaje", "Descanso", "Verano", "Hotel"]],
  ["Reloj", ["Hora", "Tiempo", "Agujas", "Muñeca"]],
  ["Bombero", ["Fuego", "Incendio", "Manguera", "Camión"]],
  ["Biblioteca", ["Libros", "Leer", "Silencio", "Préstamo"]],
  ["Dulce de leche", ["Dulce", "Leche", "Alfajor", "Cuchara"]],
  ["Gimnasio", ["Pesas", "Entrenar", "Músculos", "Ejercicio"]],
  ["Luna", ["Noche", "Cielo", "Llena", "Astronauta"]],
  ["Mudanza", ["Cajas", "Casa", "Camión", "Muebles"]],
  ["Despertador", ["Alarma", "Mañana", "Dormir", "Sonar"]],
  ["Fantasma", ["Sábana", "Miedo", "Espíritu", "Muerto"]],
  ["Ascensor", ["Piso", "Subir", "Bajar", "Botón"]],
  ["Karaoke", ["Cantar", "Micrófono", "Canción", "Letra"]],
  ["Siesta", ["Dormir", "Tarde", "Cama", "Descansar"]],
  ["Tren", ["Vías", "Estación", "Vagón", "Andén"]],
];

export const WORDS: readonly WordCard[] = DRAFTS.map(([word, forbidden], index) => ({
  id: `pal-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  word,
  forbidden,
}));

export const WORD_IDS = WORDS.map((card) => card.id);

export function getWordCard(id: string): WordCard | undefined {
  return WORDS.find((card) => card.id === id);
}

export const RULES: readonly string[] = [
  "Armen dos equipos y elijan cuánto dura cada turno.",
  "Quien describe ve la palabra y las cuatro prohibidas; su equipo no mira.",
  "Hay que hacerla adivinar hablando, sin decir la palabra ni las prohibidas.",
  "Cada acierto suma un punto. Si se dice una prohibida o se traban, pasen sin sumar.",
  "Al terminar las rondas, gana el equipo con más puntos.",
];
