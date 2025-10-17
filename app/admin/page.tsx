"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { Loader2, Minus, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddExcoModal from "./_components/AddExcoModal";
import AddMemberModal from "./_components/AddMemberModal";
import AddNewsModal from "./_components/AddNewsModal";
import AddTestimonialModal from "./_components/AddTestimonialModal";
import DeleteExcoModal from "./_components/DeleteExcoModal";
import DeleteMemberModal from "./_components/DeleteMemberModal";
import DeleteNewsModal from "./_components/DeleteNewsModal";
import DeleteTestimonialModal from "./_components/DeleteTestimonialModal";
import UpdateExcoModal from "./_components/UpdateExcoModal";
import UpdateMemberModal from "./_components/UpdateMemberModal";
import UpdateNewsModal from "./_components/UpdateNewsModal";
import UpdateTestimonialModal from "./_components/UpdateTestimonialModal";

const AdminPage = () => {
  const members = useQuery(api.members.getAllMembers);
  const news = useQuery(api.news.getAllNews);
  const excos = useQuery(api.excos.getExcos);
  const testimonials = useQuery(api.testimonials.getAllTestimonials);
  const registrations = useQuery(api.registration.getAllRegistrations);

  const [searchQuery, setSearchQuery] = useState("");
  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    id: string;
    currentStatus: boolean;
    name: string;
  }>({
    open: false,
    id: "",
    currentStatus: false,
    name: "",
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const updateRegistrationStatus = useMutation(
    api.registration.updateRegistrationStatus
  );

  // Filter news based on search query (title or date)
  const filteredNews = useMemo(() => {
    if (!news) return undefined;
    if (!searchQuery.trim()) return news;

    const query = searchQuery.toLowerCase().trim();
    return news.filter((item) => {
      const title = item.title.toLowerCase();
      const date = dayjs(item._creationTime)
        .format("MMMM DD, YYYY")
        .toLowerCase();
      return title.includes(query) || date.includes(query);
    });
  }, [news, searchQuery]);

  // Filter members based on search query and status
  const filteredMembers = useMemo(() => {
    if (!members) return undefined;

    let filtered = members;

    // Apply search filter
    if (memberSearchQuery.trim()) {
      const query = memberSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (memberStatusFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (memberStatusFilter === "active") {
          return item.status === true;
        } else if (memberStatusFilter === "inactive") {
          return item.status === false || item.status === undefined;
        }
        return true;
      });
    }

    return filtered;
  }, [members, memberSearchQuery, memberStatusFilter]);

  // Filter registrations based on search query and status
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return undefined;

    let filtered = registrations;

    // Apply search filter
    if (regSearchQuery.trim()) {
      const query = regSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (statusFilter === "active") {
          return item.status === true;
        } else if (statusFilter === "inactive") {
          return item.status === false || item.status === undefined;
        }
        return true;
      });
    }

    return filtered;
  }, [registrations, regSearchQuery, statusFilter]);

  // Handle status change confirmation
  const handleStatusChange = async () => {
    setIsUpdatingStatus(true);
    try {
      const newStatus = !confirmModal.currentStatus;
      const result = await updateRegistrationStatus({
        id: confirmModal.id as Id<"registration">,
        status: newStatus,
      });

      if (result.memberUpdated) {
        toast.success(
          `Registration and Member marked as ${newStatus ? "Active" : "Inactive"}!`,
          {
            description:
              "Both registration and member records have been updated.",
          }
        );
      } else {
        toast.success(
          `Registration marked as ${newStatus ? "Active" : "Inactive"}!`
        );
      }

      setConfirmModal({ open: false, id: "", currentStatus: false, name: "" });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className='px-4 pb-12 pt-24 w-full min-h-screen max-w-5xl mx-auto'>
      <h1 className='text-2xl md:text-4xl text-center font-bold mb-8'>
        Admin Management Page
      </h1>
      <div className='flex w-full  flex-col gap-6'>
        <Tabs defaultValue='members'>
          <TabsList className='w-full overflow-x-auto flex justify-start gap-2 scrollbar-hide'>
            <TabsTrigger value='members'>Members</TabsTrigger>
            <TabsTrigger value='registration'>Registration</TabsTrigger>
            <TabsTrigger value='news'>News</TabsTrigger>
            <TabsTrigger value='directors'>Directors</TabsTrigger>
            <TabsTrigger value='events'>Events</TabsTrigger>
            <TabsTrigger value='testimonials'>Testimonials</TabsTrigger>
          </TabsList>
          <TabsContent value='members'>
            <Card>
              <CardHeader className='flex  items-center justify-between'>
                <CardTitle className='text-2xl'>Members</CardTitle>

                <AddMemberModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {/* Search and Filter */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Search Input */}
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      type='text'
                      placeholder='Search by organization name...'
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className='pl-10 pr-10 transition-all duration-300 focus:ring-2'
                    />
                    {memberSearchQuery && (
                      <button
                        onClick={() => setMemberSearchQuery("")}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                        <X className='h-4 w-4' />
                      </button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <Select
                    value={memberStatusFilter}
                    onValueChange={(value: "all" | "active" | "inactive") =>
                      setMemberStatusFilter(value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Members</SelectItem>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredMembers === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading members...
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className='text-center px-4 py-32 animate-pulse'>
                    {memberSearchQuery || memberStatusFilter !== "all"
                      ? "No matching members found"
                      : "No members found"}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {filteredMembers.map((member) => (
                      <div
                        key={member._id}
                        className={`rounded-xl border p-6 space-y-4 bg-card`}>
                        <div className='space-y-2'>
                          <div className='flex items-start justify-between'>
                            <h3 className='text-lg font-semibold flex-1'>
                              {member.name}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                member.status
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}>
                              {member.status === true ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            Est. {dayjs(member.established).format("MMMM YYYY")}
                          </p>
                        </div>

                        <div className='flex flex-wrap gap-x-6 text-sm pt-2 border-t'>
                          <p className='flex items-start gap-2'>
                            <span className='text-muted-foreground'>
                              Members:
                            </span>
                            <span className='font-medium'>
                              {member.numberOfMembers}
                            </span>
                          </p>
                          <p className='flex items-start gap-2'>
                            <span className='text-muted-foreground'>
                              Email:
                            </span>
                            <a
                              href={`mailto:${member.email}`}
                              className='text-primary hover:underline break-all'>
                              {member.email}
                            </a>
                          </p>
                          <p className='flex items-start gap-2'>
                            <span className='text-muted-foreground'>
                              Phone:
                            </span>
                            <a
                              href={`tel:${member.phoneNumber}`}
                              className='text-primary hover:underline'>
                              {member.phoneNumber}
                            </a>
                          </p>
                          {member.websiteUrl && (
                            <p className='flex items-start gap-2'>
                              <span className='text-muted-foreground'>
                                Website:
                              </span>
                              <a
                                href={member.websiteUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-primary hover:underline break-all text-xs'>
                                {member.websiteUrl}
                              </a>
                            </p>
                          )}
                          <p className='flex items-start gap-2'>
                            <span className='text-muted-foreground'>
                              Address:
                            </span>
                            <span className='text-muted-foreground text-xs'>
                              {member.address}
                            </span>
                          </p>
                        </div>

                        <div className='flex gap-x-4 pt-2 border-t justify-end items-center'>
                          <UpdateMemberModal member={member} />
                          <DeleteMemberModal member={member} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='registration'>
            <Card>
              <CardHeader className='flex  items-center justify-between'>
                <CardTitle className='text-2xl'>Registration</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-6'>
                {/* Search and Filter */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Search Input */}
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      type='text'
                      placeholder='Search by organization name...'
                      value={regSearchQuery}
                      onChange={(e) => setRegSearchQuery(e.target.value)}
                      className='pl-10 pr-10 transition-all duration-300 focus:ring-2'
                    />
                    {regSearchQuery && (
                      <button
                        onClick={() => setRegSearchQuery("")}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                        <X className='h-4 w-4' />
                      </button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <Select
                    value={statusFilter}
                    onValueChange={(value: "all" | "active" | "inactive") =>
                      setStatusFilter(value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Registrations</SelectItem>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredRegistrations === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading registration details...
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className='text-center px-4 py-32 animate-pulse'>
                    {regSearchQuery || statusFilter !== "all"
                      ? "No matching registrations found"
                      : "No registration details found"}
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {filteredRegistrations.map((registration) => (
                      <div
                        key={registration._id}
                        className='rounded-xl border p-6 space-y-4 bg-card'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <h3 className='text-xl font-semibold'>
                              {registration.name}
                            </h3>
                            <p className='text-sm text-muted-foreground mt-1'>
                              Established:{" "}
                              {dayjs(registration.established).format(
                                "MMMM YYYY"
                              )}
                            </p>
                          </div>
                          <div className='text-right space-y-2'>
                            <span className='text-sm font-medium block'>
                              {registration.numberOfMembers} Members
                            </span>
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center gap-2'>
                                <Label
                                  htmlFor={`status-${registration._id}`}
                                  className='text-sm font-medium'>
                                  {registration.status ? (
                                    <span className='text-green-600'>
                                      Active
                                    </span>
                                  ) : (
                                    <span className='text-orange-600'>
                                      Inactive
                                    </span>
                                  )}
                                </Label>
                                <Switch
                                  id={`status-${registration._id}`}
                                  checked={registration.status || false}
                                  onCheckedChange={() => {
                                    setConfirmModal({
                                      open: true,
                                      id: registration._id,
                                      currentStatus:
                                        registration.status || false,
                                      name: registration.name,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t'>
                          <div>
                            <h4 className='text-sm font-semibold mb-2'>
                              Contact Information
                            </h4>
                            <div className='space-y-2 text-sm'>
                              <p>
                                <span className='text-muted-foreground'>
                                  Email:
                                </span>{" "}
                                <a
                                  href={`mailto:${registration.email}`}
                                  className='text-primary hover:underline'>
                                  {registration.email}
                                </a>
                              </p>
                              <p>
                                <span className='text-muted-foreground'>
                                  Phone:
                                </span>{" "}
                                <a
                                  href={`tel:${registration.phoneNumber}`}
                                  className='text-primary hover:underline'>
                                  {registration.phoneNumber}
                                </a>
                              </p>
                              {registration.websiteUrl && (
                                <p>
                                  <span className='text-muted-foreground'>
                                    Website:
                                  </span>{" "}
                                  <a
                                    href={registration.websiteUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary hover:underline'>
                                    {registration.websiteUrl}
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className='text-sm font-semibold mb-2'>
                              Address
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              {registration.address}
                            </p>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t'>
                          <div>
                            <h4 className='text-sm font-semibold mb-2'>
                              Registration Certificate
                            </h4>
                            {registration.registrationCertificateUrl ? (
                              <a
                                href={registration.registrationCertificateUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 text-sm text-primary hover:underline'>
                                📄 View Certificate
                              </a>
                            ) : (
                              <p className='text-sm text-muted-foreground'>
                                Not available
                              </p>
                            )}
                          </div>

                          <div>
                            <h4 className='text-sm font-semibold mb-2'>
                              Payment Receipt
                            </h4>
                            {registration.paymentReceiptUrl ? (
                              <a
                                href={registration.paymentReceiptUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 text-sm text-primary hover:underline'>
                                🧾 View Receipt
                              </a>
                            ) : (
                              <p className='text-sm text-muted-foreground'>
                                Not available
                              </p>
                            )}
                          </div>
                        </div>

                        <div className='pt-4 border-t text-xs text-muted-foreground'>
                          Submitted on{" "}
                          {dayjs(registration._creationTime).format(
                            "MMMM DD, YYYY [at] h:mm A"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='news'>
            <Card>
              <CardHeader className='flex  items-center justify-between'>
                <CardTitle className='text-2xl'>News</CardTitle>

                <AddNewsModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {/* Search Input */}
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Search by title or date (e.g., "January 2025")...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10 pr-10 transition-all duration-300 focus:ring-2'
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>

                {filteredNews === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading news...
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className='text-center px-4 py-32 animate-pulse'>
                    {searchQuery
                      ? "No news found matching your search"
                      : "No news found"}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredNews.map((item) => (
                      <div
                        key={item._id}
                        className='rounded-xl overflow-hidden shadow-lg border max-w-sm mx-auto'>
                        <div className='relative w-full aspect-video'>
                          <Image
                            alt=''
                            fill
                            src={item.imageUrl || ""}
                            className='object-cover'
                          />
                        </div>
                        <div className='p-4 space-y-3'>
                          <p className='text-sm text-muted-foreground'>
                            {dayjs(item._creationTime).format("MMMM DD, YYYY")}
                          </p>
                          <h3 className='text-lg font-semibold line-clamp-2'>
                            {item.title}
                          </h3>
                          <div className='flex gap-2 justify-between'>
                            <UpdateNewsModal news={item} />
                            <DeleteNewsModal news={item} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='directors'>
            <Card>
              <CardHeader className='flex  items-center justify-between'>
                <CardTitle className='text-2xl'>Directors</CardTitle>

                <AddExcoModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {excos === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading Directors...
                  </div>
                ) : excos.length === 0 ? (
                  <div className='text-center px-4 py-32 animate-pulse'>
                    No executives found
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {excos.map((exco) => (
                      <div
                        key={exco._id}
                        className='rounded-xl overflow-hidden shadow-lg border p-6 flex flex-col items-center text-center space-y-4'>
                        <div className='relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20'>
                          <Image
                            alt={exco.name}
                            fill
                            src={exco.imageUrl || ""}
                            className='object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold'>{exco.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {exco.position}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {exco.description}
                          </p>
                        </div>
                        <div className='flex justify-between gap-2 w-full pt-2'>
                          <UpdateExcoModal exco={exco} />
                          <DeleteExcoModal exco={exco} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='events'>
          <div className="px-4 py-32 text-center">Coming Soon!</div>
          </TabsContent>
          <TabsContent value='testimonials'>
            <Card>
              <CardHeader className='flex  items-center justify-between'>
                <CardTitle className='text-2xl'>Testimonials</CardTitle>

                <AddTestimonialModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {testimonials === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading testimonials...
                  </div>
                ) : testimonials.length === 0 ? (
                  <div className='text-center px-4 py-32 animate-pulse'>
                    No testimonial found
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial._id}
                        className='rounded-xl overflow-hidden shadow-lg border p-6 flex flex-col space-y-4'>
                        <div className='space-y-3 flex-1'>
                          <div className='flex items-start justify-between'>
                            <h3 className='text-lg font-semibold'>
                              {testimonial.name}
                            </h3>
                            <div className='flex gap-0.5'>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-lg ${
                                    star <= testimonial.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className='text-sm text-muted-foreground line-clamp-4'>
                            {testimonial.body}
                          </p>
                        </div>
                        <div className='flex justify-between gap-2 w-full pt-2'>
                          <UpdateTestimonialModal testimonial={testimonial} />
                          <DeleteTestimonialModal testimonial={testimonial} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Change Confirmation Modal */}
      <Dialog
        open={confirmModal.open}
        onOpenChange={(open) =>
          !isUpdatingStatus && setConfirmModal({ ...confirmModal, open })
        }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmModal.currentStatus
                ? "Mark as Inactive?"
                : "Mark as Active?"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this registration as{" "}
              <strong>
                {confirmModal.currentStatus ? "Inactive" : "Active"}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='rounded-lg bg-muted p-4'>
              <p className='text-sm font-semibold'>{confirmModal.name}</p>
              <p className='text-xs text-muted-foreground mt-2'>
                Current Status:{" "}
                <span
                  className={
                    confirmModal.currentStatus
                      ? "text-green-600 font-medium"
                      : "text-orange-600 font-medium"
                  }>
                  {confirmModal.currentStatus ? "Active" : "Inactive"}
                </span>
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                New Status:{" "}
                <span
                  className={
                    !confirmModal.currentStatus
                      ? "text-green-600 font-medium"
                      : "text-orange-600 font-medium"
                  }>
                  {!confirmModal.currentStatus ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() =>
                setConfirmModal({
                  open: false,
                  id: "",
                  currentStatus: false,
                  name: "",
                })
              }
              disabled={isUpdatingStatus}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
