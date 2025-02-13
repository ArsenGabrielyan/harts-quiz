"use client"
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <PageLayout mainClassName="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl lg:text-5xl">Բարի Գալուստ Հարց</h1>
      <p className="my-4">Հավելված, որով դուք կզարգացնեք ձեր միտքը</p>
      <div className="flex gap-x-2">
        <Button asChild>
          <Link href="/play">Խաղալ</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/explore">Ուսումնասիրել</Link>
        </Button>
      </div>
    </PageLayout>
  );
}
