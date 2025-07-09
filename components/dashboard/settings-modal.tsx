"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Career = {
  id: number;
  name: string;
  slug: string;
  isDegree: boolean;
  parentCareerId: number | null;
  requiredExtraCredits: number | null;
};

const SettingsModal = ({ open, onOpenChange }: Props) => {
  const [selectedCareers, setSelectedCareers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todas las carreras disponibles
  const { data: allCareers } = api.career.getAll.useQuery();

  // Obtener las carreras seleccionadas del usuario
  const { data: userCareers } = api.user.getUserCareers.useQuery();

  // Obtener el contexto de tRPC para invalidar queries
  const utils = api.useUtils();

  // Mutación para actualizar las carreras del usuario
  const updateUserCareersMutation = api.user.updateUserCareers.useMutation({
    onSuccess: () => {
      // Invalidar la query para que el sidebar se actualice
      utils.user.getUserCareers.invalidate();
      toast.success("Carreras actualizadas correctamente");
      onOpenChange(false);
    },
    onError: (error: { message: string }) => {
      toast.error("Error al actualizar las carreras: " + error.message);
    },
  });

  // Inicializar las carreras seleccionadas cuando se cargan los datos
  useEffect(() => {
    if (userCareers) {
      setSelectedCareers(userCareers.map((career: Career) => career.id));
    }
  }, [userCareers]);

  // Separar carreras por tipo
  const degrees = allCareers?.filter((career: Career) => career.isDegree) || [];
  const technicalPrograms =
    allCareers?.filter((career: Career) => !career.isDegree) || [];

  const handleCareerToggle = (careerId: number) => {
    setSelectedCareers((prev) =>
      prev.includes(careerId)
        ? prev.filter((id) => id !== careerId)
        : [...prev, careerId]
    );
  };

  const handleSave = async () => {
    if (selectedCareers.length === 0) {
      toast.error("Debes seleccionar al menos una carrera");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserCareersMutation.mutateAsync({
        careerIds: selectedCareers,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>
            Selecciona las carreras en las que estás inscripto.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Licenciaturas */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Licenciaturas</Label>
            <div className="flex flex-col space-y-2">
              {degrees.map((career: Career) => (
                <div key={career.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={career.id.toString()}
                    checked={selectedCareers.includes(career.id)}
                    onChange={() => handleCareerToggle(career.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor={career.id.toString()}
                    className="cursor-pointer"
                  >
                    {career.name}
                  </Label>
                </div>
              ))}
              {degrees.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay licenciaturas disponibles
                </p>
              )}
            </div>
          </div>

          {/* Tecnicaturas */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tecnicaturas</Label>
            <div className="flex flex-col space-y-2">
              {technicalPrograms.map((career: Career) => (
                <div key={career.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={career.id.toString()}
                    checked={selectedCareers.includes(career.id)}
                    onChange={() => handleCareerToggle(career.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor={career.id.toString()}
                    className="cursor-pointer"
                  >
                    {career.name}
                  </Label>
                </div>
              ))}
              {technicalPrograms.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay tecnicaturas disponibles
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { SettingsModal };
