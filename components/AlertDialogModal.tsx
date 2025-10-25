import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import RegisterMemberModal from "./activate-cooperative-modal";

export function AlertDialogModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Activate Your Cooperative</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-red-500'>NOTE!</AlertDialogTitle>
          <AlertDialogDescription>
            This activation process is not for individuals but solely for the
            management of the primary cooperative societies under FEDCOOP. If
            you represent your cooperative society, click on the
            &apos;Continue&apos; button below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <RegisterMemberModal />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
