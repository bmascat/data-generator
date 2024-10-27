import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DataGenerator from "@/components/data-generator";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <DataGenerator />
    </main>
  );
}
