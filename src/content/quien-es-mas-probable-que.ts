import type { ContentItem } from "@/types/game";

export type Question = ContentItem & {
  text: string;
};

const TEXTS = [
  "¿Quién es más probable que llegue tarde a su propio cumpleaños?",
  "¿Quién sobreviviría menos tiempo en una isla desierta?",
  "¿Quién se haría famoso por accidente?",
  "¿Quién organizaría un viaje y se olvidaría de reservar el alojamiento?",
  "¿Quién sería eliminado primero de un reality show?",
  "¿Quién es más probable que se pierda usando el GPS?",
  "¿Quién es más probable que se quede dormido en el cine?",
  "¿Quién es más probable que le hable a su mascota como a una persona?",
  "¿Quién es más probable que mande un audio de diez minutos?",
  "¿Quién es más probable que se ría en el momento menos indicado?",
  "¿Quién es más probable que compre algo inútil a las tres de la mañana?",
  "¿Quién es más probable que se olvide las llaves adentro de su casa?",
  "¿Quién es más probable que cuente el final de una película sin querer?",
  "¿Quién es más probable que termine bailando arriba de una mesa?",
  "¿Quién es más probable que adopte cinco perros en un mes?",
  "¿Quién es más probable que abandone el gimnasio después de una semana?",
  "¿Quién es más probable que se haga amigo del taxista?",
  "¿Quién es más probable que llore con una publicidad?",
  "¿Quién es más probable que mande un mensaje al grupo equivocado?",
  "¿Quién es más probable que pida lo mismo de siempre en un restaurante nuevo?",
  "¿Quién es más probable que se olvide de un cumpleaños importante?",
  "¿Quién es más probable que discuta con un árbitro por televisión?",
  "¿Quién es más probable que se mude a otro país de un día para el otro?",
  "¿Quién es más probable que gane la lotería y pierda el billete?",
  "¿Quién es más probable que llegue primero a una fiesta y se quede hasta el final?",
  "¿Quién es más probable que aprenda un idioma solo para pedir comida?",
  "¿Quién es más probable que se duerma en una videollamada?",
  "¿Quién es más probable que siga una receta y termine pidiendo delivery?",
  "¿Quién es más probable que se suba al colectivo equivocado y no se dé cuenta?",
  "¿Quién es más probable que le haga un discurso a una planta?",
  "¿Quién es más probable que tenga cuarenta pestañas abiertas en el celular?",
  "¿Quién es más probable que cuente la misma anécdota por décima vez?",
  "¿Quién es más probable que se disfrace en una fiesta que no era de disfraces?",
  "¿Quién es más probable que empiece una serie y no duerma hasta terminarla?",
  "¿Quién es más probable que regale algo que le regalaron a esa misma persona?",
  "¿Quién es más probable que se haga viral bailando?",
  "¿Quién es más probable que se olvide de por qué entró a una habitación?",
  "¿Quién es más probable que le pida una foto a un famoso que no es famoso?",
  "¿Quién es más probable que arme un plan de diez pasos para ir al supermercado?",
  "¿Quién es más probable que pierda el celular mientras habla por el celular?",
  "¿Quién sobreviviría más tiempo en un apocalipsis zombi?",
  "¿Quién ganaría un concurso de comer empanadas?",
  "¿Quién sería el peor copiloto en un viaje largo?",
  "¿Quién sería presidente del país por error?",
  "¿Quién abriría un negocio que cierra en una semana?",
  "¿Quién se perdería en su propio barrio?",
  "¿Quién tendría la peor excusa para faltar al trabajo?",
  "¿Quién escribiría un libro de autoayuda sin ayudarse a sí mismo?",
  "¿Quién contestaría todas las preguntas del juego de la tele sin saber nada?",
  "¿Quién se quedaría encerrado en un baño en una fiesta?",
  "¿Quién haría un asado y se olvidaría de comprar la carne?",
  "¿Quién terminaría siendo el villano de una película?",
  "¿Quién se enamoraría de alguien en la fila del banco?",
  "¿Quién ganaría una pelea de miradas contra un gato?",
  "¿Quién se iría de vacaciones sin avisarle a nadie?",
  "¿Quién tiene más chances de convencer a todos de cualquier cosa?",
];

export const QUESTIONS: readonly Question[] = TEXTS.map((text, index) => ({
  id: `qmp-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  text,
}));

export const QUESTION_IDS = QUESTIONS.map((question) => question.id);

export function getQuestionText(id: string): string | undefined {
  return QUESTIONS.find((question) => question.id === id)?.text;
}
