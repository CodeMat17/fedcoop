"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";

type Props = {
  image: string | null;
  name?: string | null;
  profile?: string | null;
};

const Profile = ({ image, name, profile }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {image && (
            <div className='flex justify-center sm:justify-start'>
              <Image
                alt=''
                priority
                width={80}
                height={80}
                src={image}
                className='rounded-full object-cover overflow-hidden'
              />
            </div>
          )}
          {name && <DialogTitle>{name}</DialogTitle>}
        </DialogHeader>

        <div className='text-center sm:text-start text-sm max-h-[300px] overflow-y-auto'>
          {profile ? (
            <p className='text-muted-foreground'>{profile}</p>
          ) : (
            <p className="text-muted-foreground italic animate-pulse">No profile data found</p>
          )}
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
