"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

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
      <Tabs defaultValue={firstTabsValues} className="mt-3">
        <TabsList className="bg-gray-200 w-[85vw] mx-auto">
          <TabsTrigger value={firstTabsValues} onClick={firstTabsOnClick}>
            {firstTabsTitle}
          </TabsTrigger>
          <TabsTrigger value={seconsdTabsValues} onClick={secondTabsOnClick}>
            {seconsdTabsTitle}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={firstTabsValues} className="max-w-[95vw]">
          {firstTabsContent}
        </TabsContent>
        <TabsContent value={seconsdTabsValues} className="justify-items-center">
          {seconsdTabsContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}
