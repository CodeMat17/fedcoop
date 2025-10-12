"use client";

import RegisterModal from "@/components/register-modal";
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
  Globe,
  Mail,
  Minus,
  Phone,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
  const members = useQuery(api.members.getAllMembers);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSocieties = members
    ? members.filter((member) => {
        const matchesSearch = member.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && member.status === true) ||
          (statusFilter === "inactive" &&
            (member.status === false || member.status === undefined));
        return matchesSearch && matchesStatus;
      })
    : [];

  const activeCount = members
    ? members.filter((s) => s.status === true).length
    : 0;
  const inactiveCount = members
    ? members.filter((s) => s.status === false || s.status === undefined).length
    : 0;
  const totalMembers = members
    ? members.reduce((sum, s) => sum + s.numberOfMembers, 0)
    : 0;

  return (
    <div className='min-h-screen pb-12 pt-24 px-4'>
      <div className='w-full max-w-5xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold tracking-tight mb-4'>
            Our Member Cooperatives
          </h1>
          <p className='text-lg text-muted-foreground max-w-3xl mx-auto mb-6'>
            Discover the diverse network of cooperative societies that make up
            our federation. Each society represents a community of dedicated
            members working together for mutual benefit.
          </p>

          <RegisterModal />
        </div>

        {/* Statistics */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-8 mb-8'>
          <Card>
            <CardContent className='p-6 text-center'>
              <Building2 className='h-8 w-8 mx-auto mb-2 text-primary' />
              <div className='text-2xl font-bold'>{members?.length || 0}</div>
              <p className='text-sm text-muted-foreground'>Total Societies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6 text-center'>
              <Users className='h-8 w-8 mx-auto mb-2 text-green-600' />
              <div className='text-2xl font-bold'>
                {totalMembers.toLocaleString()}
              </div>
              <p className='text-sm text-muted-foreground'>Total Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6 text-center'>
              <CheckCircle className='h-8 w-8 mx-auto mb-2 text-green-600' />
              <div className='text-2xl font-bold text-green-600'>
                {activeCount}
              </div>
              <p className='text-sm text-muted-foreground'>Active Societies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6 text-center'>
              <XCircle className='h-8 w-8 mx-auto mb-2 text-orange-600' />
              <div className='text-2xl font-bold text-orange-600'>
                {inactiveCount}
              </div>
              <p className='text-sm text-muted-foreground'>
                Inactive Societies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search by name or short name...'
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
              <SelectItem value='all'>All Societies</SelectItem>
              <SelectItem value='active'>Active Only</SelectItem>
              <SelectItem value='inactive'>Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className='mb-6'>
          <p className='text-sm text-muted-foreground'>
            Showing {filteredSocieties.length} of {members?.length || 0}{" "}
            societies
          </p>
        </div>

        {members === undefined ? (
          <div className='flex items-center justify-center py-12'>
            <Minus className='w-4 h-4 mr-2 animate-spin' />
            <span>loading members...</span>
          </div>
        ) : filteredSocieties.length === 0 ? (
          <div className='text-center py-12'>
            <Building2 className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
            <h3 className='text-lg font-semibold mb-2'>No societies found</h3>
            <p className='text-muted-foreground'>
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {filteredSocieties.map((member) => (
              <Card
                key={member._id}
                className={`hover:shadow-lg transition-shadow duration-300 ${
                  member.status === false || member.status === undefined
                    ? "opacity-60 grayscale"
                    : ""
                }`}>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <CardTitle className='text-lg leading-tight'>
                      {member.name}
                    </CardTitle>
                    <Badge
                      variant={member.status === true ? "default" : "secondary"}
                      className={
                        member.status === true
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }>
                      {member.status === true ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground font-medium'>
                    Established{" "}
                    {member.established
                      ? new Date(member.established + "-01").toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long" }
                        )
                      : "N/A"}
                  </p>
                </CardHeader>

                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center text-sm'>
                      <Users className='h-4 w-4 mr-2 text-muted-foreground' />
                      <span className='font-medium mr-2'>
                        {member.numberOfMembers.toLocaleString()}
                      </span>
                      <span className='text-muted-foreground'>members</span>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-x-4 pt-4 border-t space-y-2'>
                    <div className='flex items-center text-sm'>
                      <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                      <a
                        href={`mailto:${member.email}`}
                        className='text-muted-foreground hover:text-primary truncate'>
                        {member.email}
                      </a>
                    </div>

                    <div className='flex items-center text-sm'>
                      <Phone className='h-4 w-4 mr-2 text-muted-foreground' />
                      <a
                        href={`tel:${member.phoneNumber}`}
                        className='text-muted-foreground hover:text-primary'>
                        {member.phoneNumber}
                      </a>
                    </div>

                    {member.websiteUrl ? (
                      <div className='flex items-center text-sm'>
                        <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                        <a
                          href={member.websiteUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:underline truncate'>
                          {member.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    ) : (
                      <div className='flex items-center text-sm'>
                        <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                        <p
                        
                          className='text-primary hover:underline truncate'>
                          No online presence
                        </p>
                      </div>
                    )}

                    <div className='text-sm text-muted-foreground'>
                      <span className='font-medium'>Address:</span>{" "}
                      {member.address}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
