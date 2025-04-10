import { CareerProgramWrapper } from "@/components/career-program-wrapper";
import { db } from "@/server/db/drizzle";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allCareers = await db.query.careers.findMany();
  return allCareers.map((career) => ({
    slug: career.slug,
  }));
}

async function getCareerBySlug(slug: string) {
  const career = await db.query.careers.findFirst({
    where: (careers, { eq }) => eq(careers.slug, slug),
    with: {
      periods: {
        orderBy: (periods, { asc }) => asc(periods.order),
        with: {
          courses: {
            with: {
              course: {
                with: {
                  correlatives: {
                    with: {
                      requiredCourse: {
                        columns: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return career;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const career = await getCareerBySlug(slug);

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
        <CareerProgramWrapper career={career} />
      </section>
    </div>
  );
};
export default Page;
