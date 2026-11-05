import type { ContentItem } from "@/types/game";

export type Category = ContentItem & {
  text: string;
};

export const RULES: readonly string[] = [
  "Elijan cuántos segundos dura cada turno y con cuántas vidas arrancan.",
  "Sale una categoría: en tu turno, decí algo que entre ahí antes de que explote el tiempo.",
  "Nadie puede repetir. El grupo decide en voz alta si vale y marca el resultado en la pantalla.",
  "Si repetís, te equivocás o te quedás sin tiempo, perdés una vida.",
  "Cada vida perdida trae una categoría nueva, así nadie tiene que acordarse de lo anterior. Gana el último con vidas.",
];

const TEXTS = [
  "Cosas que hay en una cocina",
  "Excusas para llegar tarde",
  "Países",
  "Marcas de autos",
  "Cosas que no deberías decir en una entrevista de trabajo",
  "Objetos que llevarías a una isla desierta",
  "Frutas",
  "Verduras",
  "Animales con cuatro patas",
  "Animales que viven en el agua",
  "Capitales del mundo",
  "Ciudades de Argentina",
  "Colores",
  "Deportes",
  "Instrumentos musicales",
  "Profesiones",
  "Partes del cuerpo",
  "Prendas de ropa",
  "Medios de transporte",
  "Electrodomésticos",
  "Herramientas",
  "Flores y plantas",
  "Cosas que hay en un baño",
  "Cosas que hay en una escuela",
  "Cosas que hay en un supermercado",
  "Cosas que hay en un asado",
  "Cosas que llevás a la playa",
  "Cosas que llevás siempre en la mochila",
  "Sabores de helado",
  "Gustos de pizza",
  "Golosinas",
  "Bebidas",
  "Comidas que se comen con la mano",
  "Comidas típicas de algún país",
  "Películas que vio todo el mundo",
  "Películas animadas",
  "Series de televisión",
  "Superhéroes y villanos",
  "Personajes de dibujos animados",
  "Cantantes o bandas",
  "Canciones que todos saben cantar",
  "Juegos de mesa",
  "Juegos de cuando eras chico",
  "Videojuegos",
  "Aplicaciones del celular",
  "Marcas de zapatillas",
  "Equipos de fútbol",
  "Futbolistas",
  "Personajes históricos",
  "Nombres de perro",
  "Nombres que empiecen con M",
  "Palabras que empiecen con P",
  "Palabras que terminen en -ción",
  "Cosas que son redondas",
  "Cosas que son rojas",
  "Cosas que vuelan",
  "Cosas que tienen ruedas",
  "Cosas que se enchufan",
  "Cosas que se rompen fácil",
  "Cosas que dan miedo",
  "Cosas que te ponen de mal humor",
  "Cosas que hacés antes de dormir",
  "Cosas que perdés todo el tiempo",
  "Cosas para hacer en un día de lluvia",
  "Cosas que dicen las abuelas",
  "Cosas que nunca le dirías a tus suegros",
  "Excusas para no ir al gimnasio",
  "Excusas para faltar al trabajo",
  "Razones para cancelar un plan",
  "Regalos que nadie quiere recibir",
  "Trabajos que nunca harías",
  "Lugares para una primera cita",
  "Lugares para ir de vacaciones",
];

export const CATEGORIES: readonly Category[] = TEXTS.map((text, index) => ({
  id: `cat-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  text,
}));

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id);

export function getCategoryText(id: string): string | undefined {
  return CATEGORIES.find((category) => category.id === id)?.text;
}
