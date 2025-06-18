import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className='w-full py-24  text-center'>
      <div className='container max-w-4xl mx-auto px-4'>
        <h1 className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl mb-4'>
          Automatically generate your{" "}
          <code className='bg-slate-200 px-1 rounded'>llms.txt</code> from any
          sitemap
        </h1>
        <p className='text-lg text-muted-foreground mb-8'>
          No stress. No coding. Just drop your sitemap and get a compliant{" "}
          <code>llms.txt</code> in seconds—for free.
        </p>
        <div className='flex justify-center flex-wrap gap-4'>
          <Button variant='default' size='lg' asChild>
            <Link href={"https://llmstxt.org/"} target='_blank'>
              Learn more about <code>llms.txt</code>{" "}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
