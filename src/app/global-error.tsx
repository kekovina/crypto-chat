'use client';
import '@/shared/styles/scss/main.scss';
import { Metadata } from 'next';

// Error boundaries must be Client Components
export const metadata: Metadata = {
  title: 'Something went wrong | DappSide',
};

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className='container mx-auto my-auto px-4'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <div className='flex-1 flex flex-col items-center gap-2'>
              <h2 className='text-3xl font-bold text-danger text-center'>
                Opps.. <br /> Something went wrong
              </h2>
              <div className='text-center'>
                <p className='text-sm md:text-base font-bold'>
                  We are sorry that you are seeing this screen.
                </p>
                <p className='text-sm md:text-base font-bold'>
                  We have already received information about the problem and will fix it soon.
                </p>
              </div>
            </div>
            <button onClick={() => reset()}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
