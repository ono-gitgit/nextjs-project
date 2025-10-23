"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TabProp = {
  heading: string;
  firstTabsValues: string;
  firstTabsOnClick?: () => void;
  firstTabsTitle: string;
  firstTabsContent: ReactNode;
  seconsdTabsValues: string;
  secondTabsOnClick?: () => void;
  seconsdTabsTitle: string;
  seconsdTabsContent: ReactNode;
};

export default function Tab({
  heading,
  firstTabsValues,
  firstTabsOnClick,
  firstTabsTitle,
  firstTabsContent,
  seconsdTabsValues,
  secondTabsOnClick,
  seconsdTabsTitle,
  seconsdTabsContent,
}: TabProp) {
  return (
    <div className="mt-8 justify-items-center">
      <div>
        <h1 className="font-serif w-[80vw]">
          {heading}
          <hr className="border-black border-2 rounded-[5px] w-full" />
        </h1>
      </div>
      <Accordion
        type="single"
        collapsible
        className="mt-2 w-[80vw] rounded-2xl bg-[#3F9877]"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="ml-3 text-[#FAFAFA]">
            詳細を確認する
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance bg-[#FAFAFA]">
            <Tabs defaultValue={firstTabsValues} className="mt-3 w-[80vw]">
              <TabsList className="bg-gray-200 w-[78vw] mx-auto">
                <TabsTrigger value={firstTabsValues} onClick={firstTabsOnClick}>
                  {firstTabsTitle}
                </TabsTrigger>
                <TabsTrigger
                  value={seconsdTabsValues}
                  onClick={secondTabsOnClick}
                >
                  {seconsdTabsTitle}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value={firstTabsValues}
                className="flex justify-center"
              >
                {firstTabsContent}
              </TabsContent>
              <TabsContent
                value={seconsdTabsValues}
                className="justify-items-center"
              >
                {seconsdTabsContent}
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
