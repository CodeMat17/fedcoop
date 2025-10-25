"use client";

import { AlertDialogModal } from "@/components/AlertDialogModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  Loader2,
  Mail,
  Phone,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
  const cooperatives = useQuery(api.cooperatives.getAllCooperatives);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSocieties = cooperatives
    ? cooperatives.filter((cooperative) => {
        const matchesSearch = cooperative.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || cooperative.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const activeCount = cooperatives
    ? cooperatives.filter((s) => s.status === "active").length
    : 0;
  const inactiveCount = cooperatives
    ? cooperatives.filter((s) => s.status === "inactive").length
    : 0;
  const processingCount = cooperatives
    ? cooperatives.filter((s) => s.status === "processing").length
    : 0;
  

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "processing":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className='h-4 w-4 ' />;
      case "inactive":
        return <XCircle className='h-4 w-4' />;
      case "processing":
        return <Clock className='h-4 w-4' />;
      default:
        return <Clock className='h-4 w-4' />;
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "processing":
        return "Processing";
      default:
        return "Unknown";
    }
  };

  return (
    <div className='min-h-screen pb-12 pt-24 px-4'>
      <div className='w-full max-w-5xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-center justify-center mb-12 lg:justify-between'>
          <div className='text-center lg:text-start'>
            <h1 className='text-4xl font-bold tracking-tight mb-4'>
              Our Member Cooperatives
            </h1>
            <p className='text-lg text-muted-foreground max-w-xl mx-auto mb-6'>
              Discover the diverse network of cooperative societies that make up
              our federation. Each society represents a community of dedicated
              members working together for mutual benefit.
            </p>
          </div>

          <AlertDialogModal />
        </div>

        {/* Statistics */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mb-8'>
          <Card>
            <CardContent className='p-4 text-center'>
              <Building2 className='h-6 w-6 mx-auto mb-2 text-primary' />
              <div className='text-xl font-bold flex items-center justify-center gap-2'>
                {cooperatives === undefined || cooperatives === null ? (
                  <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                ) : (
                  cooperatives?.length || 0
                )}
              </div>
              <p className='text-xs text-muted-foreground'>Total Cooperative</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 text-center'>
              <CheckCircle className='h-6 w-6 mx-auto mb-2 text-green-600' />
              <div className='flex items-center justify-center gap-2 text-xl font-bold text-green-600'>
                {cooperatives === undefined || cooperatives === null ? (
                  <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                ) : (
                  activeCount
                )}
              </div>
              <p className='text-xs text-muted-foreground'>Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 text-center'>
              <Clock className='h-6 w-6 mx-auto mb-2 text-blue-600' />
              <div className='flex items-center justify-center gap-2 text-xl font-bold text-blue-600'>
                {cooperatives === undefined || cooperatives === null ? (
                  <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                ) : (
                  processingCount
                )}
              </div>
              <p className='text-xs text-muted-foreground'>Processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 text-center'>
              <XCircle className='h-6 w-6 mx-auto mb-2 text-orange-600' />
              <div className='flex items-center justify-center gap-2 text-xl font-bold text-orange-600'>
                {cooperatives === undefined || cooperatives === null ? (
                  <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                ) : (
                  inactiveCount
                )}
              </div>
              <p className='text-xs text-muted-foreground'>Inactive</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search by name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Cooperative</SelectItem>
              <SelectItem value='active'>Active Only</SelectItem>
              <SelectItem value='processing'>Processing Only</SelectItem>
              <SelectItem value='inactive'>Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className='mb-6'>
          <p className='text-sm text-muted-foreground'>
            Showing {filteredSocieties.length} of {cooperatives?.length || 0}{" "}
            cooperatives
          </p>
        </div>

        {cooperatives === undefined ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            <span>Loading cooperatives...</span>
          </div>
        ) : filteredSocieties.length === 0 ? (
          <div className='text-center py-12'>
            <Building2 className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
            <h3 className='text-lg font-semibold mb-2'>No cooperative found</h3>
            <p className='text-muted-foreground'>
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {filteredSocieties.map((cooperative) => (
              <Card
                key={cooperative._id}
                className={`hover:shadow-lg transition-shadow duration-300 ${
                  cooperative.status === "inactive"
                    ? "opacity-60 grayscale"
                    : ""
                }`}>
                <CardHeader className=''>
                  <div className='space-y-2'>
                    <Badge
                      variant={getStatusBadgeVariant(cooperative.status)}
                      className={`flex items-center gap-1 w-fit py-0.5 ${getStatusBadgeStyle(cooperative.status)}`}>
                      {getStatusIcon(cooperative.status)}
                      {getStatusDisplayText(cooperative.status)}
                    </Badge>
                    <CardTitle className='text-lg leading-tight'>
                      {cooperative.name}
                    </CardTitle>
                  </div>

                  {cooperative.status === "active" && (
                    <div className='mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-8'></div>
                  )}

                  {cooperative.status === "processing" && (
                    <p className='text-sm text-muted-foreground animate-pulse'>
                      Processing activation, Please wait...
                    </p>
                  )}
                </CardHeader>

                {cooperative.status === "active" && (
                  <CardContent className='space-y-4'>
                    <div className='flex flex-wrap gap-x-4 pt-4 border-t space-y-2'>
                      {cooperative.email && (
                        <div className='flex items-center text-sm'>
                          <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                          <a
                            href={`mailto:${cooperative.email}`}
                            className='text-muted-foreground hover:text-primary truncate'>
                            {cooperative.email}
                          </a>
                        </div>
                      )}

                      {cooperative.phoneNumber && (
                        <div className='flex items-center text-sm'>
                          <Phone className='h-4 w-4 mr-2 text-muted-foreground' />
                          <a
                            href={`tel:${cooperative.phoneNumber}`}
                            className='text-muted-foreground hover:text-primary'>
                            {cooperative.phoneNumber}
                          </a>
                        </div>
                      )}

                      {cooperative.websiteUrl ? (
                        <div className='flex items-center text-sm'>
                          <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                          <a
                            href={cooperative.websiteUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary hover:underline truncate'>
                            {cooperative.websiteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      ) : (
                        <div className='flex items-center text-sm'>
                          <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                          <p className='text-muted-foreground truncate'>
                            No website
                          </p>
                        </div>
                      )}

                      {cooperative.address && (
                        <div className='text-sm text-muted-foreground'>
                          <span className='font-medium'>Address:</span>{" "}
                          {cooperative.address}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
