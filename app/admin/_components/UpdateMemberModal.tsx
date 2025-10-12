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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MemberItem {
  _id: Id<"members">;
  name: string;
  established: string;
  email: string;
  phoneNumber: string;
  websiteUrl?: string;
  address: string;
  status?: boolean;
  numberOfMembers: number;
}

interface UpdateMemberModalProps {
  member: MemberItem;
}

const UpdateMemberModal = ({ member }: UpdateMemberModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [phoneNumber, setPhoneNumber] = useState(member.phoneNumber);
  const [websiteUrl, setWebsiteUrl] = useState(member.websiteUrl || "");
  const [address, setAddress] = useState(member.address);
  const [numberOfMembers, setNumberOfMembers] = useState(
    member.numberOfMembers.toString()
  );
  const [establishedMonth, setEstablishedMonth] = useState(
    member.established.split("-")[1]
  );
  const [establishedYear, setEstablishedYear] = useState(
    member.established.split("-")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateMember = useMutation(api.members.updateMember);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName(member.name);
      setEmail(member.email);
      setPhoneNumber(member.phoneNumber);
      setWebsiteUrl(member.websiteUrl || "");
      setAddress(member.address);
      setNumberOfMembers(member.numberOfMembers.toString());
      setEstablishedMonth(member.established.split("-")[1]);
      setEstablishedYear(member.established.split("-")[0]);
    }
  }, [open, member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter organization name");
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

    if (!numberOfMembers.trim() || parseInt(numberOfMembers) < 1) {
      toast.error("Please enter valid number of members");
      return;
    }

    if (!establishedMonth || !establishedYear) {
      toast.error("Please select established date");
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
      const established = `${establishedYear}-${establishedMonth.padStart(2, "0")}`;

      await updateMember({
        id: member._id,
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        websiteUrl: finalWebsiteUrl,
        address: address.trim(),
        numberOfMembers: parseInt(numberOfMembers),
        established: established,
      });

      toast.success("Member updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update member. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' className=''><Edit /></Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Member</DialogTitle>
            <DialogDescription>
              Edit the member details and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Organization Name */}
            <div className='grid gap-3'>
              <Label htmlFor='name'>Organization Name *</Label>
              <Input
                id='name'
                placeholder='Enter organization name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
              />
            </div>

            {/* Established Date */}
            <div className='grid gap-3'>
              <Label>Established Date *</Label>
              <div className='grid grid-cols-2 gap-4'>
                <Select
                  value={establishedMonth}
                  onValueChange={setEstablishedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder='Month' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='01'>January</SelectItem>
                    <SelectItem value='02'>February</SelectItem>
                    <SelectItem value='03'>March</SelectItem>
                    <SelectItem value='04'>April</SelectItem>
                    <SelectItem value='05'>May</SelectItem>
                    <SelectItem value='06'>June</SelectItem>
                    <SelectItem value='07'>July</SelectItem>
                    <SelectItem value='08'>August</SelectItem>
                    <SelectItem value='09'>September</SelectItem>
                    <SelectItem value='10'>October</SelectItem>
                    <SelectItem value='11'>November</SelectItem>
                    <SelectItem value='12'>December</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={establishedYear}
                  onValueChange={setEstablishedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder='Year' />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Number of Members */}
            <div className='grid gap-3'>
              <Label htmlFor='numberOfMembers'>Number of Members *</Label>
              <Input
                id='numberOfMembers'
                type='number'
                min='1'
                placeholder='Enter number of members'
                value={numberOfMembers}
                onChange={(e) => setNumberOfMembers(e.target.value)}
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
                "Update Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMemberModal;
