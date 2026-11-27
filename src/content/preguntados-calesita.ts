import type { ContentItem } from "@/types/game";

export const QUESTION_CATEGORIES = [
  "Geografía",
  "Ciencia",
  "Historia",
  "Deportes",
  "Entretenimiento",
  "Argentina",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export type Question = ContentItem & {
  category: QuestionCategory;
  text: string;
  options: readonly string[];
  /** Index into options. */
  answer: number;
};

type Draft = Omit<Question, "id" | "packId">;

/**
 * Facts with one clear, checkable answer. New entries go at the end, so
 * existing ids keep their meaning in stored games.
 */
const DRAFTS: readonly Draft[] = [
  { category: "Geografía", text: "¿Cuál es el río más largo de América del Sur?", options: ["Paraná", "Amazonas", "Orinoco", "Uruguay"], answer: 1 },
  { category: "Geografía", text: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Perth"], answer: 2 },
  { category: "Geografía", text: "¿Cuál es el océano más grande?", options: ["Atlántico", "Índico", "Ártico", "Pacífico"], answer: 3 },
  { category: "Geografía", text: "¿En qué continente está Egipto?", options: ["África", "Asia", "Europa", "Oceanía"], answer: 0 },
  { category: "Geografía", text: "¿Cuál es el país más grande del mundo?", options: ["Canadá", "China", "Rusia", "Estados Unidos"], answer: 2 },
  { category: "Geografía", text: "¿Cuál es la capital de Japón?", options: ["Osaka", "Tokio", "Kioto", "Seúl"], answer: 1 },
  { category: "Geografía", text: "¿Qué país tiene forma de bota?", options: ["España", "Grecia", "Portugal", "Italia"], answer: 3 },
  { category: "Ciencia", text: "¿Cuál es el planeta más cercano al Sol?", options: ["Mercurio", "Venus", "Marte", "Tierra"], answer: 0 },
  { category: "Ciencia", text: "¿Cuántas patas tiene una araña?", options: ["6", "8", "10", "12"], answer: 1 },
  { category: "Ciencia", text: "¿Qué gas respiran las plantas para hacer la fotosíntesis?", options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Helio"], answer: 2 },
  { category: "Ciencia", text: "¿Cuál es el símbolo químico del oro?", options: ["Or", "Go", "Ag", "Au"], answer: 3 },
  { category: "Ciencia", text: "¿Cuántos huesos tiene el cuerpo humano adulto?", options: ["206", "180", "250", "312"], answer: 0 },
  { category: "Ciencia", text: "¿A qué temperatura hierve el agua al nivel del mar?", options: ["90 °C", "100 °C", "110 °C", "120 °C"], answer: 1 },
  { category: "Ciencia", text: "¿Cuál es el planeta más grande del sistema solar?", options: ["Saturno", "Neptuno", "Júpiter", "Urano"], answer: 2 },
  { category: "Historia", text: "¿En qué año llegó el ser humano a la Luna?", options: ["1959", "1969", "1979", "1989"], answer: 1 },
  { category: "Historia", text: "¿Quién pintó la Mona Lisa?", options: ["Leonardo da Vinci", "Miguel Ángel", "Picasso", "Van Gogh"], answer: 0 },
  { category: "Historia", text: "¿En qué año cayó el Muro de Berlín?", options: ["1979", "1985", "1989", "1995"], answer: 2 },
  { category: "Historia", text: "¿Qué civilización construyó Machu Picchu?", options: ["Azteca", "Maya", "Olmeca", "Inca"], answer: 3 },
  { category: "Historia", text: "¿En qué año llegó Colón a América?", options: ["1492", "1502", "1482", "1512"], answer: 0 },
  { category: "Historia", text: "¿En qué país se construyeron las pirámides de Giza?", options: ["México", "Egipto", "Perú", "Irak"], answer: 1 },
  { category: "Deportes", text: "¿Cuántos jugadores tiene un equipo de fútbol en la cancha?", options: ["9", "10", "11", "12"], answer: 2 },
  { category: "Deportes", text: "¿Cada cuántos años se juega un Mundial de fútbol?", options: ["2", "3", "5", "4"], answer: 3 },
  { category: "Deportes", text: "¿En qué deporte se usa un tee?", options: ["Golf", "Tenis", "Hockey", "Rugby"], answer: 0 },
  { category: "Deportes", text: "¿Cuántos puntos vale un triple en básquet?", options: ["2", "3", "4", "1"], answer: 1 },
  { category: "Deportes", text: "¿Qué país ganó el Mundial de fútbol de 2022?", options: ["Francia", "Brasil", "Argentina", "Croacia"], answer: 2 },
  { category: "Deportes", text: "¿Cuántos sets hay que ganar en una final masculina de Grand Slam?", options: ["2", "4", "5", "3"], answer: 3 },
  { category: "Entretenimiento", text: "¿Cómo se llama el muñeco vaquero de Toy Story?", options: ["Woody", "Buzz", "Jessie", "Rex"], answer: 0 },
  { category: "Entretenimiento", text: "¿Qué banda grabó «Bohemian Rhapsody»?", options: ["The Beatles", "Queen", "ABBA", "U2"], answer: 1 },
  { category: "Entretenimiento", text: "¿Cómo se llama el león protagonista de El Rey León?", options: ["Mufasa", "Scar", "Simba", "Nala"], answer: 2 },
  { category: "Entretenimiento", text: "¿De qué color es Pikachu?", options: ["Rojo", "Azul", "Verde", "Amarillo"], answer: 3 },
  { category: "Entretenimiento", text: "¿Quién es el mejor amigo de Bob Esponja?", options: ["Patricio", "Calamardo", "Don Cangrejo", "Arenita"], answer: 0 },
  { category: "Entretenimiento", text: "¿En qué escuela estudia Harry Potter?", options: ["Beauxbatons", "Hogwarts", "Durmstrang", "Ilvermorny"], answer: 1 },
  { category: "Argentina", text: "¿En qué año se declaró la independencia argentina?", options: ["1810", "1806", "1816", "1820"], answer: 2 },
  { category: "Argentina", text: "¿En qué provincia están las Cataratas del Iguazú?", options: ["Corrientes", "Salta", "Entre Ríos", "Misiones"], answer: 3 },
  { category: "Argentina", text: "¿Cuál es el cerro más alto de América?", options: ["Aconcagua", "Fitz Roy", "Tupungato", "Lanín"], answer: 0 },
  { category: "Argentina", text: "¿Quién creó la bandera argentina?", options: ["San Martín", "Belgrano", "Sarmiento", "Moreno"], answer: 1 },
  { category: "Argentina", text: "¿Cuál es la capital de la provincia de Córdoba?", options: ["Río Cuarto", "Villa María", "Córdoba", "Carlos Paz"], answer: 2 },
  { category: "Argentina", text: "¿Desde qué ciudad se visita el glaciar Perito Moreno?", options: ["Ushuaia", "Bariloche", "Esquel", "El Calafate"], answer: 3 },
  { category: "Argentina", text: "¿Cuántas provincias tiene Argentina?", options: ["23", "24", "22", "25"], answer: 0 },
  { category: "Argentina", text: "¿Quién escribió el Martín Fierro?", options: ["Borges", "José Hernández", "Cortázar", "Sarmiento"], answer: 1 },
];

export const QUESTIONS: readonly Question[] = DRAFTS.map((draft, index) => ({
  ...draft,
  id: `pre-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
}));

export const QUESTION_IDS = QUESTIONS.map((question) => question.id);

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((question) => question.id === id);
}

export const RULES: readonly string[] = [
  "Elijan cuántas preguntas le tocan a cada uno.",
  "En cada turno, una persona responde una pregunta con cuatro opciones.",
  "Toca su respuesta y la app muestra si acertó.",
  "Cada acierto suma un punto. Sin ayuda del grupo, eh.",
  "Al terminar, gana quien tenga más puntos.",
];
