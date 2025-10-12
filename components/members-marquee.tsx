import { cn } from "@/lib/utils";
import { Marquee } from "./ui/marquee";

const reviews = [
  {
    name: "NFVCB",
  },
  {
    name: "CBN",
  },
  {
    name: "ICPC",
  },
  {
    name: "NTA",
  },
  {
    name: "NBC",
  },
  {
    name: "EFCC",
  },
  {
    name: "NCC",
  },
  {
    name: "FMD",
  },
  {
    name: "NNPC",
  },
  {
    name: "FMAFS",
  },
  {
    name: "CBN",
  },
  {
    name: "FMTI",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(0, reviews.length / 2);
const fourthRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ name }: { name: string }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-4 sm:w-36",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}>
      <div className='flex flex-row items-center gap-2'>
        <div className='flex flex-col'>
          <figcaption className='text-sm font-medium dark:text-white text-center'>
            {name}
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

export function MembersMarquee() {
  return (
    <div className='relative flex h-96 w-[300px] sm:w-[450px] mx-auto items-center justify-center gap-4 overflow-hidden [perspective:300px]'>
      <div
        className='flex flex-row items-center gap-2 md:gap-4'
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}>
        <Marquee pauseOnHover vertical className='[--duration:50s]'>
          {firstRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className='[--duration:50s]' vertical>
          {secondRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className='[--duration:50s]' vertical>
          {thirdRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className='[--duration:50s]' vertical>
          {fourthRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
      </div>

      <div className='from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b'></div>
      <div className='from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t'></div>
      <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r'></div>
      <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l'></div>
    </div>
  );
}
