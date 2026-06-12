import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/lib/faqs";

export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
          <AccordionTrigger className="text-left font-display text-xl italic hover:text-bloom hover:no-underline sm:text-2xl">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
