"use client";

import { useUserData } from "@/context/user-data-context";
import { Badge } from "@/components/ui/badge";

interface Props {
  career: Career;
}

const CareerProgressBar = ({ career }: Props) => {
  const { userProgress } = useUserData();

  // Obtener todos los cursos de la carrera
  const allCourses =
    career.periods?.flatMap(
      (period) =>
        period.courses?.map((courseRelation) => courseRelation.course) || []
    ) || [];

  // Filtrar el progreso del usuario para esta carrera específica
  const careerProgress = userProgress.filter(
    (progress) =>
      progress && allCourses.some((course) => course.id === progress.courseId)
  );

  // Calcular estadísticas
  const totalCourses = allCourses.length;
  const approvedCourses = careerProgress.filter(
    (p) => p && p.status === "APROBADA"
  ).length;
  const regularizedCourses = careerProgress.filter(
    (p) => p && p.status === "REGULARIZADA"
  ).length;
  const inProgressCourses = careerProgress.filter(
    (p) => p && p.status === "CURSANDO"
  ).length;
  const pendingCourses =
    totalCourses - approvedCourses - regularizedCourses - inProgressCourses;

  // Calcular porcentaje de aprobación
  const approvedPercentage =
    totalCourses > 0 ? Math.round((approvedCourses / totalCourses) * 100) : 0;

  // Colores para cada estado usando las variables CSS definidas
  const statusColors = {
    approved: "bg-approved",
    regularized: "bg-regularized",
    inProgress: "bg-studying",
    pending: "bg-pending",
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="relative flex h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`${statusColors.approved} transition-all duration-300`}
            style={{ width: `${approvedPercentage}%` }}
          />
          <div
            className={`${statusColors.regularized} transition-all duration-300`}
            style={{ width: `${(regularizedCourses / totalCourses) * 100}%` }}
          />
          <div
            className={`${statusColors.inProgress} transition-all duration-300`}
            style={{ width: `${(inProgressCourses / totalCourses) * 100}%` }}
          />
          <div
            className={`${statusColors.pending} transition-all duration-300`}
            style={{ width: `${(pendingCourses / totalCourses) * 100}%` }}
          />
          {/* Porcentaje total centrado en la barra */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow-sm">
              {approvedPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-4 sm:justify-items-center gap-2">
        <div className="flex items-center gap-1 text-xs">
          <Badge className="bg-approved text-approved-foreground rounded-full">
            {approvedCourses}
          </Badge>
          <span className="text-approved font-medium truncate">Aprobadas</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <Badge className="bg-regularized text-regularized-foreground rounded-full">
            {regularizedCourses}
          </Badge>
          <span className="text-regularized font-medium truncate">
            Regularizadas
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <Badge className="bg-studying text-studying-foreground rounded-full">
            {inProgressCourses}
          </Badge>
          <span className="text-studying font-medium truncate">Cursando</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <Badge className="bg-pending text-pending-foreground rounded-full">
            {pendingCourses}
          </Badge>
          <span className="text-pending font-medium truncate">Pendientes</span>
        </div>
      </div>
    </div>
  );
};

export { CareerProgressBar };
