import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
          <Image
            src='/images/logo/logo_blue.png'
            alt={"Logo"}
            width={50}
            height={50}
          />
          <span>llms.txt Generator</span>
        </Link>

        <div className='flex items-center gap-4'>
          <Button size='lg' className='font-bold text-lg' asChild>
            <Link href='#generate'>Generate now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
