'use client'
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

const CustomAccordionItem = ({ title, content }: { title: string, content: React.ReactNode }) => {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{content}</AccordionContent>
    </AccordionItem>
  );
};

const CustomAccordion = ({ items }: AccordionProps) => {
  return (
    <Accordion type="multiple">
      {items.map((item, index) => (
        <CustomAccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </Accordion>
  );
};

export default CustomAccordion;
