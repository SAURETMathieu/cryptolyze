import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

const faqs = [
  {
    id: 1,
    question: "What is the capital of France fzerzefzefezf?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime dolorum recusandae, nostrum tenetur cupiditate ipsa culpa praesentium ullam doloribus fugiat, voluptatem, delectus quisquam iure laudantium reiciendis cumque consequatur fuga dignissimos.",
  },
  {
    id: 2,
    question: "What is the capital of Spain?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime dolorum recusandae, nostrum tenetur cupiditate ipsa culpa praesentium ullam doloribus fugiat, voluptatem, delectus quisquam iure laudantium reiciendis cumque consequatur fuga dignissimos.",
  },
  {
    id: 3,
    question: "What is the capital of Italy?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime dolorum recusandae, nostrum tenetur cupiditate ipsa culpa praesentium ullam doloribus fugiat, voluptatem, delectus quisquam iure laudantium reiciendis cumque consequatur fuga dignissimos.",
  },
  {
    id: 4,
    question: "What is the capital of Germany?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime dolorum recusandae, nostrum tenetur cupiditate ipsa culpa praesentium ullam doloribus fugiat, voluptatem, delectus quisquam iure laudantium reiciendis cumque consequatur fuga dignissimos.",
  },
];

export default function QuestionList() {
  return (
    <Accordion
      type="single"
      collapsible
      className="mt-4 w-full border-t text-xs lg:text-sm"
    >
      {faqs.map((faq) => (
        <AccordionItem value={faq.question} key={faq.id} className="">
          <AccordionTrigger className="flex w-full items-center justify-between gap-2 py-4 pr-2 text-start text-lg font-semibold">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="p-4 pl-0 pt-0 text-base">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
