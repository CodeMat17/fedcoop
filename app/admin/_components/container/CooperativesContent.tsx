import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import AddCooperativeModal from "../AddCooperativeModal";
import { Minus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UpdateCooperativeModal from "../UpdateCooperativeModal";
import DeleteCooperativeModal from "../DeleteCooperativeModal";

const CooperativesContent = () => {
  const cooperatives = useQuery(api.cooperatives.getAllCooperatives);

  const [cooperativeSearchQuery, setCooperativeSearchQuery] = useState("");
  const [cooperativeStatusFilter, setCooperativeStatusFilter] = useState<
    "all" | "inactive" | "processing" | "active"
  >("all");

  // Filter members based on search query and status
  const filteredCooperatives = useMemo(() => {
    if (!cooperatives) return undefined;

    let filtered = cooperatives;

    // Apply search filter
    if (cooperativeSearchQuery.trim()) {
      const query = cooperativeSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (cooperativeStatusFilter !== "all") {
      filtered = filtered.filter((item) => {
        return item.status === cooperativeStatusFilter;
      });
    }

    return filtered;
  }, [cooperatives, cooperativeSearchQuery, cooperativeStatusFilter]);

  // Get status display info
  const getStatusInfo = (status: "inactive" | "processing" | "active") => {
    switch (status) {
      case "active":
        return { label: "Active", className: "bg-green-100 text-green-700" };
      case "inactive":
        return { label: "Inactive", className: "bg-red-100 text-red-700" };
      case "processing":
        return {
          label: "Processing",
          className: "bg-orange-100 text-orange-700",
        };
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <CardTitle className='text-xl sm:text-2xl'>Cooperatives</CardTitle>
        <AddCooperativeModal />
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
              value={cooperativeSearchQuery}
              onChange={(e) => setCooperativeSearchQuery(e.target.value)}
              className='pl-10 pr-10 transition-all duration-300 focus:ring-2'
            />
            {cooperativeSearchQuery && (
              <button
                onClick={() => setCooperativeSearchQuery("")}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                <X className='h-4 w-4' />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <Select
            value={cooperativeStatusFilter}
            onValueChange={(
              value: "all" | "active" | "inactive" | "processing"
            ) => setCooperativeStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Cooperatives</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
              <SelectItem value='processing'>Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredCooperatives === undefined ? (
          <div className='flex px-4 py-32 items-center justify-center'>
            <Minus className='w-4 h-4 animate-spin mr-2' />
            Loading members...
          </div>
        ) : filteredCooperatives.length === 0 ? (
          <div className='text-center px-4 py-32 text-muted-foreground'>
            {cooperativeSearchQuery || cooperativeStatusFilter !== "all"
              ? "No matching cooperative found"
              : "No cooperative found"}
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredCooperatives.map((cooperative) => {
              const statusInfo = getStatusInfo(cooperative.status);
              return (
                <div
                  key={cooperative._id}
                  className='rounded-xl border p-4 sm:p-6 space-y-4 bg-card'>
                  <div className='space-y-2'>
                    <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-2'>
                      <h3 className='text-lg font-semibold flex-1 break-words'>
                        {cooperative.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusInfo.className} self-start sm:self-auto`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {cooperative.status === "inactive" ? (
                    ""
                  ) : (
                    <>
                      <div className='flex flex-wrap gap-x-5 text-sm pt-2 border-t'>
                        {cooperative.email && (
                          <p className=''>
                            <span className='text-muted-foreground min-w-20'>
                              Email:{" "}
                            </span>
                            <a
                              href={`mailto:${cooperative.email}`}
                              className='text-primary hover:underline break-all'>
                              {cooperative.email}
                            </a>
                          </p>
                        )}
                        {cooperative.phoneNumber && (
                          <p className=''>
                            <span className='text-muted-foreground min-w-20'>
                              Phone:{" "}
                            </span>
                            <a
                              href={`tel:${cooperative.phoneNumber}`}
                              className='text-primary hover:underline'>
                              {cooperative.phoneNumber}
                            </a>
                          </p>
                        )}
                        {cooperative.websiteUrl && (
                          <p className=''>
                            <span className='text-muted-foreground min-w-20'>
                              Website:{" "}
                            </span>
                            <a
                              href={cooperative.websiteUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary hover:underline break-all text-xs'>
                              {cooperative.websiteUrl}
                            </a>
                          </p>
                        )}
                        {cooperative.address && (
                          <p>
                            <span className='text-muted-foreground min-w-20'>
                              Address:{" "}
                            </span>
                            <span className='text-muted-foreground text-xs break-words'>
                              {cooperative.address}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 pt-2 border-t'>
                        <div className='flex items-center gap-4'>
                          <h4 className='text-sm font-semibold'>Certificate</h4>
                          {cooperative.certificateUrl ? (
                            <a
                              href={cooperative.certificateUrl}
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
                          <h4 className='text-sm font-semibold'>
                            Payment Receipt
                          </h4>
                          {cooperative.paymentReceiptUrl ? (
                            <a
                              href={cooperative.paymentReceiptUrl}
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
                    </>
                  )}

                  <div className='flex gap-2 pt-2 border-t justify-end items-center'>
                    <UpdateCooperativeModal cooperative={cooperative} />
                    <DeleteCooperativeModal cooperative={cooperative} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CooperativesContent;
