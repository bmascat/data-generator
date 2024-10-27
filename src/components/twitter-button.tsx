import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function TwitterButton() {
  return (
    <div className="flex flex-wrap items-center justify-center my-5">        
        <Button
          className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-6 text-sm font-semibold text-gray-700"
          asChild
        >
          <Link
            href="https://x.com/intent/follow?screen_name=brmascat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/twitter_avatar.jpg"
              alt="X logo"
              width={35}
              height={35}
              className="rounded-full mr-1"
            />
            <span className="relative">
              <Image
                src="/X_logo_2023_original.svg"
                alt="X logo"
                width={15}
                height={15}
                className="inline-block mr-1"
              />
              @brmascat
            </span>
          </Link>
        </Button>
    </div>
  );
}