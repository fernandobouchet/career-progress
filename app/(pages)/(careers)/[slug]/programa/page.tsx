import { PeriodsTabs } from "@/components/period-tabs";
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
    <div className="w-full h-full flex flex-col items-center text-center">
      <h1 className="font-semibold text-2xl">{career.name}</h1>
      <section className="w-full flex flex-col items-center py-4 gap-4">
        <h2 className="text-xl font-medium">
          {career.isDegree ? "Año" : "Cuatrimestre"}
        </h2>
        <PeriodsTabs periods={career.periods} />
      </section>
    </div>
  );
};
export default Page;
