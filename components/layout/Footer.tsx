import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className='w-full border-t bg-background py-8 md:py-12 mt-32'>
      <div className='container px-4 md:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <Link href='/' className='flex items-center gap-2 font-bold mb-4'>
              <Image
                src='/images/logo/logo_blue.png'
                alt={"Logo"}
                width={50}
                height={50}
              />
              <span>llms.txt Generator</span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              Competitor analysis reports to find the perfect restaurant
              location. Get data-driven insights on competition, market demand,
              and profitability before making your move.
            </p>
          </div>

          <div>
            <h3 className='font-semibold mb-3'>Resources</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href={`#`}
                  className='text-sm hover:text-primary transition-colors'
                >
                  About llms.tx
                </Link>
              </li>
              <li>
                <Link
                  href={`#`}
                  className='text-sm hover:text-primary transition-colors'
                >
                  About AI SEO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-3'>Project</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href={`#`}
                  className='text-sm hover:text-primary transition-colors'
                >
                  Github
                </Link>
              </li>
              <li>
                <Link
                  href={`#`}
                  className='text-sm hover:text-primary transition-colors'
                >
                  Creator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='text-xs text-muted-foreground'>
            <code className='bg-slate-200 px-1 rounded'>llms.txt</code>{" "}
            generator is an open source project from{" "}
            <Link href='https://www.francescofera.com/' className='underline'>
              Francesco Fera
            </Link>
          </div>

          <nav className='flex gap-4 md:gap-6'>
            <Link
              href='#'
              className='text-xs hover:underline underline-offset-4'
            >
              Terms of Service
            </Link>
            <Link
              href='#'
              className='text-xs hover:underline underline-offset-4'
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
