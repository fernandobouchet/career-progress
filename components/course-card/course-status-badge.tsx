import { Badge } from "../ui/badge";

interface Props {
  status: keyof typeof statusEnum | undefined;
  className?: string;
}

const CourseStatusBadge = ({ className, status }: Props) => {
  return (
    <Badge
      className={`${className} ${
        status === "CURSANDO"
          ? "bg-studying text-studying-foreground"
          : status === "REGULARIZADA"
          ? "bg-regularized text-regularized-foreground"
          : status === "APROBADA"
          ? "bg-approved text-approved-foreground"
          : "bg-pending text-pending-foreground"
      }`}
    >
      {status ?? "PENDIENTE"}
    </Badge>
  );
};

export { CourseStatusBadge };
