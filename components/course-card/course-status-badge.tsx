import { useUserData } from "@/context/user-data-context";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";

interface Props {
  status: keyof typeof StatusEnum | undefined;
  className?: string;
}

const CourseStatusBadge = ({ className, status }: Props) => {
  const { status: authStatus } = useSession();

  const { isLoading } = useUserData();

  if (authStatus === "unauthenticated") {
    return <div className="w-20 h-6 rounded-full ml-auto"></div>;
  }

  if (isLoading) {
    return <Skeleton className="w-20 h-6 rounded-full ml-auto" />;
  }

  return (
    <Badge
      className={`${className} rounded-full ${
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
