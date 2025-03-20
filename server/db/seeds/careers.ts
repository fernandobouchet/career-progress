export const careersSeed = [
  {
    id: 1,
    name: "Licenciatura en Informática",
    slug: "licenciatura-informatica",
    isDegree: true, // Licenciatura
    requiredExtraCredits: 0,
  },
  {
    id: 2,
    name: "Tecnicatura en Informática",
    slug: "tecnicatura-informatica",
    isDegree: false, // Tecnicatura
    parentCareerId: 1,
    requiredExtraCredits: 0,
  },
  {
    id: 3,
    name: "Tecnicatura en Programación",
    slug: "tecnicatura-programacion",
    isDegree: false, // Tecnicatura
    parentCareerId: 1,
    requiredExtraCredits: 30,
  },
  {
    id: 4,
    name: "Tecnicatura en Redes y Operaciones Informáticas",
    slug: "tecnicatura-redes",
    isDegree: false, // Tecnicatura
    parentCareerId: 1,
    requiredExtraCredits: 30,
  },
  {
    id: 5,
    name: "Tecnicatura en Inteligencia Artificial",
    slug: "tecnicatura-ia",
    isDegree: false, // Tecnicatura
    parentCareerId: 1,
    requiredExtraCredits: 30,
  },
  {
    id: 6,
    name: "Tecnicatura en Videojuegos",
    slug: "tecnicatura-videojuegos",
    isDegree: false, // Tecnicatura
    parentCareerId: 1,
    requiredExtraCredits: 30,
  },
];
