export const courseEquivalentsSeeds = [
  // Matemática para Informática I (90) y Matemática para Informática II (94) equivalen a Matemática I (1)
  {
    targetCourseId: 1,
    baseCourseIds: [90, 94],
  },
  // Organización de Computadoras I (92) y Organización de Computadoras II (95) equivalen a Organización de Computadoras (3)
  {
    targetCourseId: 3,
    baseCourseIds: [92, 95],
  },
  // Introducción a Lógica y Problemas Computacionales (91) y Programación Estructurada (93) equivalen a Introducción a la Programación (2)
  {
    targetCourseId: 2,
    baseCourseIds: [91, 93],
  },
];
