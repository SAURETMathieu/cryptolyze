import { H1 } from "@/src/components/ui/titles";

export default async function FaqMain({ t }: { t: MessagesIntl }) {
  return (
    <main className="min-h-main flex-1">
      <section className="mx-auto flex max-w-screen-xl flex-col justify-center p-4 md:p-8">
        <H1 className="p-2 text-center text-4xl">{t("title")}</H1>
        {/* <SearchBar
          className="mt-4 w-full"
          placeholder={t("searchPlaceholder")}
        /> */}
        <h2 className="mb-6 mt-10 text-3xl font-semibold">
          {t("frequentQuestions")}
        </h2>
        <p className="text-muted-foreground text-bold w-full text-center text-xl">
          COMING SOON...
        </p>
        {/* <QuestionList /> */}
      </section>
    </main>
  );
}
