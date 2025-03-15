import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const career = await api.career.getBySlug({ slug: slug });

  if (!career) {
    return notFound();
  }
  return (
    <div>
      <h1>{career.name}</h1>
      Estadisticas
    </div>
  );
};

export default Page;
