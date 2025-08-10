import { H1 } from "@/components/ui/titles";
import ArrowBackToLastUrl from "@/components/buttons/ArrowBackToLastUrl";
import NavigationLink from "@/components/link/NavigationLink";

export default function TitleAndBackLinkSection({
  title,
  faq,
}: {
  title: string;
  faq: string;
}) {
  return (
    <>
      <div className="relative mx-auto max-w-screen-xl">
        <ArrowBackToLastUrl />
        <H1 className="mx-auto max-w-[80%] p-0 pt-4 text-center">{title}</H1>
      </div>
      <NavigationLink
        href="/faq"
        className="hover:text-muted-foreground mx-auto block w-fit p-2 text-center underline"
      >
        {faq}
      </NavigationLink>
    </>
  );
}
