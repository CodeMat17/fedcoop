"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CooperativeItem {
  _id: Id<"cooperatives">;
  name: string;
  email?: string; // Changed to optional
  phoneNumber?: string; // Changed to optional
  websiteUrl?: string;
  address?: string; // Changed to optional
  status?: "inactive" | "processing" | "active"; // Fixed status type
}

interface UpdateCooperativeModalProps {
  cooperative: CooperativeItem;
}

const UpdateCooperativeModal = ({
  cooperative,
}: UpdateCooperativeModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(cooperative.name);
  const [email, setEmail] = useState(cooperative.email || "");
  const [phoneNumber, setPhoneNumber] = useState(cooperative.phoneNumber || "");
  const [websiteUrl, setWebsiteUrl] = useState(cooperative.websiteUrl || "");
  const [address, setAddress] = useState(cooperative.address || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateCooperative = useMutation(api.cooperatives.updateCooperative);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName(cooperative.name);
      setEmail(cooperative.email || "");
      setPhoneNumber(cooperative.phoneNumber || "");
      setWebsiteUrl(cooperative.websiteUrl || "");
      setAddress(cooperative.address || "");
    }
  }, [open, cooperative]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter cooperative name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter address");
      return;
    }

    // Prepare website URL
    let finalWebsiteUrl: string | undefined = undefined;
    if (websiteUrl.trim()) {
      let urlToValidate = websiteUrl.trim();

      // Auto-prepend https:// if no protocol is specified
      if (!urlToValidate.match(/^https?:\/\//)) {
        urlToValidate = `https://${urlToValidate}`;
      }

      try {
        new URL(urlToValidate);
        finalWebsiteUrl = urlToValidate;
      } catch {
        toast.error("Please enter a valid website URL or leave it empty");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await updateCooperative({
        id: cooperative._id,
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        websiteUrl: finalWebsiteUrl,
        address: address.trim(),
      });

      toast.success("Cooperative updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating cooperative:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update cooperative. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant={'outline'} className=''>
          <Edit className='w-5 h-5 text-amber-700 dark:text-amber-500' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Cooperative</DialogTitle> {/* Fixed title */}
            <DialogDescription>
              Edit the cooperative details and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Organization Name */}
            <div className='grid gap-3'>
              <Label htmlFor='name'>Cooperative Name *</Label>
              <Input
                id='name'
                placeholder='Enter cooperative name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
              />
            </div>

            {/* Email */}
            <div className='grid gap-3'>
              <Label htmlFor='email'>Email Address *</Label>
              <Input
                id='email'
                type='email'
                placeholder='organization@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div className='grid gap-3'>
              <Label htmlFor='phone'>Phone Number *</Label>
              <Input
                id='phone'
                type='tel'
                placeholder='+234 800 123 4567'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* Website URL */}
            <div className='grid gap-3'>
              <Label htmlFor='website'>Website URL (Optional)</Label>
              <Input
                id='website'
                type='text'
                placeholder='example.com or https://example.com'
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <span className='text-xs text-muted-foreground'>
                https:// will be added automatically if not provided
              </span>
            </div>

            {/* Address */}
            <div className='grid gap-3'>
              <Label htmlFor='address'>Address *</Label>
              <Textarea
                id='address'
                placeholder='Enter full address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button' disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                "Update Cooperative"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCooperativeModal;
