import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className='flex items-center justify-center px-4 pb-8 pt-24'>
      <SignUp />
    </div>
  );
}
