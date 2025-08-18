// === CORRELATIVAS COMPARTIDAS ENTRE TODAS LAS CARRERAS ===
export const sharedCourseCorrelativesSeed = [
  // Correlativas básicas compartidas
  { careerId: 1, courseId: 2, requiredCourseId: 1 }, // Introducción a la Programación - correlativa: Matemática I
  { careerId: 1, courseId: 3, requiredCourseId: 1 }, // Organización de Computadoras - correlativa: Matemática I
  { careerId: 1, courseId: 5, requiredCourseId: 2 }, // Estructuras de Datos - correlativa: Introducción a la Programación
  { careerId: 1, courseId: 6, requiredCourseId: 2 }, // Programación con Objetos I - correlativa: Introducción a la Programación
  { careerId: 1, courseId: 7, requiredCourseId: 1 }, // Bases de Datos - correlativa: Matemática I
  { careerId: 1, courseId: 9, requiredCourseId: 1 }, // Matemática II - correlativa: Matemática I
  { careerId: 1, courseId: 10, requiredCourseId: 6 }, // Programación con Objetos II - correlativa: Programación con Objetos I
  { careerId: 1, courseId: 11, requiredCourseId: 3 }, // Redes de Computadoras - correlativa: Organización de Computadoras
  { careerId: 1, courseId: 12, requiredCourseId: 2 }, // Sistemas Operativos - correlativa: Introducción a la Programación
  { careerId: 1, courseId: 12, requiredCourseId: 3 }, // Sistemas Operativos - correlativa: Organización de Computadoras
  { careerId: 1, courseId: 13, requiredCourseId: 5 }, // Programación Funcional - correlativa: Estructuras de Datos
  { careerId: 1, courseId: 14, requiredCourseId: 10 }, // Construcción de Interfaces de Usuario - correlativa: Programación con Objetos II
  { careerId: 1, courseId: 15, requiredCourseId: 13 }, // Algoritmos - correlativa: Programación Funcional
  { careerId: 1, courseId: 16, requiredCourseId: 7 }, // Estrategias de Persistencia - correlativa: Bases de Datos
  { careerId: 1, courseId: 16, requiredCourseId: 10 }, // Estrategias de Persistencia - correlativa: Programación con Objetos II
  { careerId: 1, courseId: 17, requiredCourseId: 11 }, // Laboratorio de Sistemas Operativos y Redes - correlativa: Redes de Computadoras
  { careerId: 1, courseId: 17, requiredCourseId: 12 }, // Laboratorio de Sistemas Operativos y Redes - correlativa: Sistemas Operativos
  { careerId: 1, courseId: 18, requiredCourseId: 9 }, // Análisis Matemático - correlativa: Matemática II
  { careerId: 1, courseId: 19, requiredCourseId: 1 }, // Lógica y Programación - correlativa: Matemática I
  { careerId: 1, courseId: 19, requiredCourseId: 2 }, // Lógica y Programación - correlativa: Introducción a la Programación
  { careerId: 1, courseId: 20, requiredCourseId: 10 }, // Elementos de Ingeniería de Software - correlativa: Programación con Objetos II
  { careerId: 1, courseId: 21, requiredCourseId: 17 }, // Seguridad de la Información - correlativa: Laboratorio de Sistemas Operativos y Redes
  { careerId: 1, courseId: 23, requiredCourseId: 8 }, // Inglés II - correlativa: Inglés I
  { careerId: 1, courseId: 24, requiredCourseId: 18 }, // Matemática III - correlativa: Análisis Matemático
  { careerId: 1, courseId: 25, requiredCourseId: 5 }, // Programación Concurrente - correlativa: Estructuras de Datos
  { careerId: 1, courseId: 26, requiredCourseId: 20 }, // Ingeniería de Requerimientos - correlativa: Elementos de Ingeniería de Software
  { careerId: 1, courseId: 27, requiredCourseId: 14 }, // Desarrollo de Aplicaciones - correlativa: Construcción de Interfaces de Usuario
  { careerId: 1, courseId: 27, requiredCourseId: 16 }, // Desarrollo de Aplicaciones - correlativa: Estrategias de Persistencia
  { careerId: 1, courseId: 27, requiredCourseId: 20 }, // Desarrollo de Aplicaciones - correlativa: Elementos de Ingeniería de Software
  { careerId: 1, courseId: 28, requiredCourseId: 24 }, // Probabilidad y Estadística - correlativa: Matemática III
  { careerId: 1, courseId: 29, requiredCourseId: 26 }, // Gestión de Proyectos de Desarrollo de Software - correlativa: Ingeniería de Requerimientos
  { careerId: 1, courseId: 30, requiredCourseId: 19 }, // Lenguajes Formales y Autómatas - correlativa: Lógica y Programación
  { careerId: 1, courseId: 31, requiredCourseId: 10 }, // Programación con Objetos III - correlativa: Programación con Objetos II
  { careerId: 1, courseId: 33, requiredCourseId: 13 }, // Práctica Profesional Supervisada - correlativa: Programación Funcional
  { careerId: 1, courseId: 33, requiredCourseId: 17 }, // Práctica Profesional Supervisada - correlativa: Laboratorio de Sistemas Operativos y Redes
  { careerId: 1, courseId: 33, requiredCourseId: 25 }, // Práctica Profesional Supervisada - correlativa: Programación Concurrente
  { careerId: 1, courseId: 33, requiredCourseId: 27 }, // Práctica Profesional Supervisada - correlativa: Desarrollo de Aplicaciones
  { careerId: 1, courseId: 34, requiredCourseId: 30 }, // Teoría de la Computación - correlativa: Lenguajes Formales y Autómatas
  { careerId: 1, courseId: 35, requiredCourseId: 20 }, // Arquitectura de Software I - correlativa: Elementos de Ingeniería de Software
  { careerId: 1, courseId: 35, requiredCourseId: 25 }, // Arquitectura de Software I - correlativa: Programación Concurrente
  { careerId: 1, courseId: 35, requiredCourseId: 27 }, // Arquitectura de Software I - correlativa: Desarrollo de Aplicaciones
  { careerId: 1, courseId: 35, requiredCourseId: 29 }, // Arquitectura de Software I - correlativa: Gestión de Proyectos de Desarrollo de Software
  { careerId: 1, courseId: 36, requiredCourseId: 17 }, // Sistemas Distribuidos y Tiempo Real - correlativa: Laboratorio de Sistemas Operativos y Redes
  { careerId: 1, courseId: 36, requiredCourseId: 25 }, // Sistemas Distribuidos y Tiempo Real - correlativa: Programación Concurrente
  { careerId: 1, courseId: 37, requiredCourseId: 29 }, // Tesina de Licenciatura - correlativa: Gestión de Proyectos de Desarrollo de Software
  { careerId: 1, courseId: 37, requiredCourseId: 30 }, // Tesina de Licenciatura - correlativa: Lenguajes Formales y Autómatas
  { careerId: 1, courseId: 37, requiredCourseId: 31 }, // Tesina de Licenciatura - correlativa: Programación con Objetos III
  { careerId: 1, courseId: 38, requiredCourseId: 7 }, // Materia Optativa I - correlativa: Bases de Datos
  { careerId: 1, courseId: 38, requiredCourseId: 10 }, // Materia Optativa I - correlativa: Programación con Objetos II
  { careerId: 1, courseId: 38, requiredCourseId: 20 }, // Materia Optativa I - correlativa: Elementos de Ingeniería de Software
  { careerId: 1, courseId: 38, requiredCourseId: 25 }, // Materia Optativa I - correlativa: Programación Concurrente
  { careerId: 1, courseId: 39, requiredCourseId: 19 }, // Características de Lenguajes de Programación - correlativa: Lógica y Programación
  { careerId: 1, courseId: 40, requiredCourseId: 35 }, // Arquitectura de Software II - correlativa: Arquitectura de Software I
  { careerId: 1, courseId: 40, requiredCourseId: 36 }, // Arquitectura de Software II - correlativa: Sistemas Distribuidos y Tiempo Real
  { careerId: 1, courseId: 41, requiredCourseId: 17 }, // Arquitectura de Computadoras - correlativa: Laboratorio de Sistemas Operativos y Redes
  { careerId: 1, courseId: 42, requiredCourseId: 7 }, // Materia Optativa II - correlativa: Bases de Datos
  { careerId: 1, courseId: 42, requiredCourseId: 10 }, // Materia Optativa II - correlativa: Programación con Objetos II
  { careerId: 1, courseId: 42, requiredCourseId: 20 }, // Materia Optativa II - correlativa: Elementos de Ingeniería de Software
  { careerId: 1, courseId: 42, requiredCourseId: 25 }, // Materia Optativa II - correlativa: Programación Concurrente
  { careerId: 1, courseId: 43, requiredCourseId: 30 }, // Parseo y generación de código - correlativa: Lenguajes Formales y Autómatas
  { careerId: 1, courseId: 43, requiredCourseId: 39 }, // Parseo y generación de código - correlativa: Características de Lenguajes de Programación

  // Correlativas para tecnicaturas (usando las materias específicas de tecnicaturas)
  { careerId: 2, courseId: 91, requiredCourseId: 90 }, // Tecnicatura Informática - Introducción a lógica y problemas computacionales - correlativa: Matemática para Informática I
  { careerId: 2, courseId: 92, requiredCourseId: 90 }, // Tecnicatura Informática - Organización de computadoras I - correlativa: Matemática para Informática I
  { careerId: 2, courseId: 5, requiredCourseId: 91 }, // Tecnicatura Informática - Estructuras de Datos - correlativa: Introducción a lógica y problemas computacionales
  { careerId: 2, courseId: 6, requiredCourseId: 5 }, // Tecnicatura Informática - Programación con Objetos I - correlativa: Estructuras de Datos
  { careerId: 2, courseId: 10, requiredCourseId: 6 }, // Tecnicatura Informática - Programación con Objetos II - correlativa: Programación con Objetos I
  { careerId: 2, courseId: 14, requiredCourseId: 10 }, // Tecnicatura Informática - Construcción de Interfaces de Usuario - correlativa: Programación con Objetos II
  { careerId: 2, courseId: 16, requiredCourseId: 7 }, // Tecnicatura Informática - Estrategias de Persistencia - correlativa: Bases de Datos
  { careerId: 2, courseId: 16, requiredCourseId: 10 }, // Tecnicatura Informática - Estrategias de Persistencia - correlativa: Programación con Objetos II

  { careerId: 3, courseId: 91, requiredCourseId: 90 }, // Tecnicatura Programación - Introducción a lógica y problemas computacionales - correlativa: Matemática para Informática I
  { careerId: 3, courseId: 92, requiredCourseId: 90 }, // Tecnicatura Programación - Organización de computadoras I - correlativa: Matemática para Informática I
  { careerId: 3, courseId: 93, requiredCourseId: 91 }, // Tecnicatura Programación - Programación estructurada - correlativa: Introducción a lógica y problemas computacionales
  { careerId: 3, courseId: 6, requiredCourseId: 93 }, // Tecnicatura Programación - Programación con Objetos I - correlativa: Programación estructurada
  { careerId: 3, courseId: 10, requiredCourseId: 6 }, // Tecnicatura Programación - Programación con Objetos II - correlativa: Programación con Objetos I
  { careerId: 3, courseId: 14, requiredCourseId: 10 }, // Tecnicatura Programación - Construcción de Interfaces de Usuario - correlativa: Programación con Objetos II
  { careerId: 3, courseId: 16, requiredCourseId: 7 }, // Tecnicatura Programación - Estrategias de Persistencia - correlativa: Bases de Datos
  { careerId: 3, courseId: 16, requiredCourseId: 10 }, // Tecnicatura Programación - Estrategias de Persistencia - correlativa: Programación con Objetos II

  { careerId: 5, courseId: 91, requiredCourseId: 90 }, // Tecnicatura IA - Introducción a lógica y problemas computacionales - correlativa: Matemática para Informática I
  { careerId: 5, courseId: 92, requiredCourseId: 90 }, // Tecnicatura IA - Organización de computadoras I - correlativa: Matemática para Informática I
  { careerId: 5, courseId: 503, requiredCourseId: 91 }, // Tecnicatura IA - Taller de Programación I - correlativa: Introducción a lógica y problemas computacionales
  { careerId: 5, courseId: 504, requiredCourseId: 503 }, // Tecnicatura IA - Taller de Programación II - correlativa: Taller de Programación I
  { careerId: 5, courseId: 508, requiredCourseId: 504 }, // Tecnicatura IA - Aprendizaje Automático - correlativa: Taller de Programación II
  { careerId: 5, courseId: 508, requiredCourseId: 511 }, // Tecnicatura IA - Aprendizaje Automático Avanzado - correlativa: Aprendizaje Automático

  { careerId: 4, courseId: 91, requiredCourseId: 90 }, // Tecnicatura Redes - Introducción a lógica y problemas computacionales - correlativa: Matemática para Informática I
  { careerId: 4, courseId: 92, requiredCourseId: 90 }, // Tecnicatura Redes - Organización de computadoras I - correlativa: Matemática para Informática I
  { careerId: 4, courseId: 95, requiredCourseId: 92 }, // Tecnicatura Redes - Organización de computadoras II - correlativa: Organización de computadoras I
  { careerId: 4, courseId: 11, requiredCourseId: 95 }, // Tecnicatura Redes - Redes de Computadoras - correlativa: Organización de computadoras II
  { careerId: 4, courseId: 402, requiredCourseId: 11 }, // Tecnicatura Redes - Operaciones I - correlativa: Redes de Computadoras
  { careerId: 4, courseId: 403, requiredCourseId: 402 }, // Tecnicatura Redes - Redes avanzadas - correlativa: Operaciones I
  { careerId: 4, courseId: 406, requiredCourseId: 403 }, // Tecnicatura Redes - Operaciones II - correlativa: Redes avanzadas

  { careerId: 6, courseId: 91, requiredCourseId: 90 }, // Tecnicatura Videojuegos - Introducción a lógica y problemas computacionales - correlativa: Matemática para Informática I
  { careerId: 6, courseId: 92, requiredCourseId: 90 }, // Tecnicatura Videojuegos - Organización de computadoras I - correlativa: Matemática para Informática I
  { careerId: 6, courseId: 93, requiredCourseId: 91 }, // Tecnicatura Videojuegos - Programación estructurada - correlativa: Introducción a lógica y problemas computacionales
  { careerId: 6, courseId: 6, requiredCourseId: 93 }, // Tecnicatura Videojuegos - Programación con Objetos I - correlativa: Programación estructurada
  { careerId: 6, courseId: 605, requiredCourseId: 6 }, // Tecnicatura Videojuegos - Programación de videojuegos I - correlativa: Programación con Objetos I
  { careerId: 6, courseId: 607, requiredCourseId: 605 }, // Tecnicatura Videojuegos - Programación de videojuegos II - correlativa: Programación de videojuegos I
];
