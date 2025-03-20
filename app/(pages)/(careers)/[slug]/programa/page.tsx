import { PeriodsTabs } from "@/components/period-tabs";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const career = await api.career.getBySlug({ slug: slug });
  console.log(career);
  if (!career) {
    return notFound();
  }
  return (
    <div className="w-full h-full flex flex-col items-center text-center">
      <h1>{career.name}</h1>
      <section className="w-full flex flex-col items-center">
        <h2>{career.isDegree ? "Año" : "Cuatrimestre"}</h2>
        <PeriodsTabs periods={career.periods} />
      </section>
    </div>
  );
};
export default Page;
