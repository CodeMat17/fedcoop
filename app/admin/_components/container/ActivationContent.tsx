"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import { Loader2, Minus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ActivationContent = () => {
  // Fetch processing cooperatives
  const processingCooperatives = useQuery(
    api.cooperatives.getCooperativesByStatus,
    {
      status: "processing",
    }
  );

  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "processing"
  >("all");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    id: string;
    currentStatus: "active" | "inactive" | "processing";
    name: string;
    newStatus: "active" | "inactive" | "processing";
  }>({
    open: false,
    id: "",
    currentStatus: "processing",
    name: "",
    newStatus: "processing",
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const updateCooperativeStatus = useMutation(
    api.cooperatives.updateCooperativeStatus
  );

  // Filter registrations based on search query and status
  const filteredRegistrations = useMemo(() => {
    if (!processingCooperatives) return undefined;

    let filtered = processingCooperatives;

    // Apply search filter
    if (regSearchQuery.trim()) {
      const query = regSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [processingCooperatives, regSearchQuery, statusFilter]);

  // Handle status change confirmation
  const handleStatusChange = async () => {
    setIsUpdatingStatus(true);
    try {
      await updateCooperativeStatus({
        id: confirmModal.id as Id<"cooperatives">,
        status: confirmModal.newStatus,
      });

      toast.success(
        `Registration status updated to ${confirmModal.newStatus}!`
      );

      setConfirmModal({
        open: false,
        id: "",
        currentStatus: "processing",
        name: "",
        newStatus: "processing",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Get status display info for string status
  const getStatusInfo = (status: "active" | "inactive" | "processing") => {
    switch (status) {
      case "active":
        return { label: "Active", className: "bg-green-100 text-green-700" };
      case "inactive":
        return { label: "Inactive", className: "bg-red-100 text-red-700" };
      case "processing":
        return {
          label: "Processing",
          className: "bg-yellow-100 text-yellow-700",
        };
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className='py-5'>
      <h1 className='text-2xl sm:text-3xl font-semibold mb-4'>
        Activation Requests
      </h1>

      <div className='grid gap-6'>
        {/* Search and Filter */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search by cooperative name...'
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
            onValueChange={(
              value: "all" | "active" | "inactive" | "processing"
            ) => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Processing</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
              <SelectItem value='processing'>Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredRegistrations === undefined ? (
          <div className='flex px-4 py-32 items-center justify-center'>
            <Minus className='w-4 h-4 animate-spin mr-2' />
            Loading activation details...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className='text-center px-4 py-32 text-muted-foreground'>
            {regSearchQuery || statusFilter !== "all"
              ? "No matching activation requests found"
              : "No activation requests found"}
          </div>
        ) : (
          <div className='space-y-6'>
            {filteredRegistrations.map((registration) => {
              const statusInfo = getStatusInfo(registration.status);
              return (
                <div
                  key={registration._id}
                  className='rounded-xl border p-4 sm:p-6 space-y-4 bg-card'>
                  <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <h3 className='text-lg sm:text-xl font-semibold break-words'>
                        {registration.name}
                      </h3>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                      <Select
                        value={registration.status}
                        onValueChange={(
                          value: "active" | "inactive" | "processing"
                        ) => {
                          setConfirmModal({
                            open: true,
                            id: registration._id,
                            currentStatus: registration.status,
                            name: registration.name,
                            newStatus: value,
                          });
                        }}>
                        <SelectTrigger className='w-32 sm:w-36'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='active'>Active</SelectItem>
                          <SelectItem value='inactive'>Inactive</SelectItem>
                          <SelectItem value='processing'>Processing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='pt-2 border-t'>
                    <div>
                      <h4 className='text-sm font-semibold mb-2'>
                        Contact Information
                      </h4>
                      <div className='flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-2 text-sm'>
                        <p>
                          <span className='text-muted-foreground'>Email:</span>{" "}
                          <a
                            href={`mailto:${registration.email}`}
                            className='text-primary hover:underline break-all'>
                            {registration.email}
                          </a>
                        </p>
                        <p>
                          <span className='text-muted-foreground'>Phone:</span>{" "}
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
                              className='text-primary hover:underline break-all'>
                              {registration.websiteUrl}
                            </a>
                          </p>
                        )}
                        {registration.address && (
                          <p className='sm:col-span-2'>
                            <span className='text-muted-foreground'>
                              Address:
                            </span>{" "}
                            {registration.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 pt-2 border-t'>
                    <div className='flex items-center gap-4'>
                      <h4 className='text-sm font-semibold'>Certificate</h4>
                      {registration.certificateUrl ? (
                        <a
                          href={registration.certificateUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 text-sm text-primary hover:underline'>
                          📄 View
                        </a>
                      ) : (
                        <p className='text-sm text-muted-foreground'>
                          Not available
                        </p>
                      )}
                    </div>

                    <div className='flex items-center gap-4'>
                      <h4 className='text-sm font-semibold'>Payment Receipt</h4>
                      {registration.paymentReceiptUrl ? (
                        <a
                          href={registration.paymentReceiptUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 text-sm text-primary hover:underline'>
                          🧾 View
                        </a>
                      ) : (
                        <p className='text-sm text-muted-foreground'>
                          Not available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='pt-2 border-t text-xs text-muted-foreground'>
                    Submitted on{" "}
                    {dayjs(registration._creationTime).format(
                      "MMMM DD, YYYY [at] h:mm A"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      <Dialog
        open={confirmModal.open}
        onOpenChange={(open) =>
          !isUpdatingStatus && setConfirmModal({ ...confirmModal, open })
        }>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Change Registration Status?</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status for{" "}
              <strong>{confirmModal.name}</strong> from{" "}
              <strong>{getStatusInfo(confirmModal.currentStatus).label}</strong>{" "}
              to <strong>{getStatusInfo(confirmModal.newStatus).label}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='rounded-lg bg-muted p-4'>
              <p className='text-sm font-semibold break-words'>
                {confirmModal.name}
              </p>
              <p className='text-xs text-muted-foreground mt-2'>
                Current Status:{" "}
                <span
                  className={`${getStatusInfo(confirmModal.currentStatus).className} px-2 py-1 rounded-full text-xs font-medium`}>
                  {getStatusInfo(confirmModal.currentStatus).label}
                </span>
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                New Status:{" "}
                <span
                  className={`${getStatusInfo(confirmModal.newStatus).className} px-2 py-1 rounded-full text-xs font-medium`}>
                  {getStatusInfo(confirmModal.newStatus).label}
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className='flex flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              onClick={() =>
                setConfirmModal({
                  open: false,
                  id: "",
                  currentStatus: "processing",
                  name: "",
                  newStatus: "processing",
                })
              }
              disabled={isUpdatingStatus}
              className='w-full sm:w-auto'>
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={isUpdatingStatus}
              className='w-full sm:w-auto'>
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

export default ActivationContent;
