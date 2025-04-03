const getFullArea = (area: string | null) => {
  switch (area) {
    case "CB":
      return "Ciencias Básicas";
    case "TC":
      return "Teoría de la Computación";
    case "AyL":
      return "Algoritmos y Lenguajes";
    case "ASOyR":
      return "Arquitectura, Sistemas Operativos y Redes";
    case "ISBDySI":
      return "Ingeniería de Software, Base de Datos y Sistemas de Información";
    case "APyS":
      return "Aspectos Profesionales y Sociales";
    default:
      return "Otras";
  }
};

export { getFullArea };
