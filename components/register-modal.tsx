"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface FormData {
  ministryName: string;
  societyShortName: string;
  registrationForm: File | null;
  paymentReceipt: File | null;
  establishedMonth: string;
  establishedYear: string;
  numberOfMembers: string;
  email: string;
  phoneNo: string;
  webAddress: string;
  address: string;
}

const RegisterModal = () => {
  const members = useQuery(api.members.getAllMembers);
  const registration = useMutation(api.registration.submitRegistration);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    ministryName: "",
    societyShortName: "",
    registrationForm: null,
    paymentReceipt: null,
    establishedMonth: "",
    establishedYear: "",
    numberOfMembers: "",
    email: "",
    phoneNo: "",
    webAddress: "",
    address: "",
  });

  // Input sanitization functions
  const sanitizeText = (text: string): string => {
    return text.replace(/[<>]/g, "").substring(0, 255);
  };

  const sanitizeTextForSubmit = (text: string): string => {
    return text.trim().replace(/[<>]/g, "").substring(0, 255);
  };

  const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase().replace(/[<>]/g, "");
  };

  const sanitizeUrl = (url: string): string => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed.match(/^https?:\/\//)) {
      return `https://${trimmed}`;
    }
    return trimmed.replace(/[<>]/g, "");
  };

  const sanitizePhone = (phone: string): string => {
    return phone
      .trim()
      .replace(/[^\d+\-\s()]/g, "")
      .substring(0, 20);
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (file.size > maxSize) return false;
    if (!allowedTypes.includes(file.type)) return false;

    // Check for suspicious file names
    const suspiciousPatterns =
      /[<>:"/\\|?*]|\.(exe|bat|cmd|scr|pif|vbs|js|jar)$/i;
    if (suspiciousPatterns.test(file.name)) return false;

    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.ministryName.trim()) {
      newErrors.ministryName = "Ministry/MDA name is required";
    } else if (formData.ministryName.length < 3) {
      newErrors.ministryName =
        "Ministry/MDA name must be at least 3 characters";
    }

    if (!formData.registrationForm) {
      newErrors.registrationForm = "Registration form is required";
    } else if (!validateFile(formData.registrationForm)) {
      newErrors.registrationForm =
        "Invalid file type or size (max 10MB, JPG/PNG/PDF only)";
    }

    if (!formData.paymentReceipt) {
      newErrors.paymentReceipt = "Payment receipt is required";
    } else if (!validateFile(formData.paymentReceipt)) {
      newErrors.paymentReceipt =
        "Invalid file type or size (max 10MB, JPG/PNG/PDF only)";
    }

    if (!formData.establishedMonth) {
      newErrors.establishedMonth = "Establishment month is required";
    }

    if (!formData.establishedYear) {
      newErrors.establishedYear = "Establishment year is required";
    }

    if (!formData.numberOfMembers.trim()) {
      newErrors.numberOfMembers = "Number of members is required";
    } else {
      const numMembers = parseInt(formData.numberOfMembers);
      if (isNaN(numMembers) || numMembers < 1 || numMembers > 100000) {
        newErrors.numberOfMembers =
          "Number of members must be between 1 and 100,000";
      }
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const cleanPhone = formData.phoneNo.replace(/[\s\-\(\)\.]/g, "");
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phoneNo = "Please enter a valid phone number (7-15 digits)";
    }

    // URL validation (optional)
    if (formData.webAddress.trim()) {
      try {
        new URL(formData.webAddress);
      } catch {
        newErrors.webAddress = "Please enter a valid website URL";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    setErrors(newErrors);

    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    let sanitizedValue = value;

    // Sanitize string inputs
    if (typeof value === "string") {
      switch (field) {
        case "ministryName":
        case "societyShortName":
        case "address":
          sanitizedValue = sanitizeText(value);
          break;
        case "email":
          sanitizedValue = sanitizeEmail(value);
          break;
        case "phoneNo":
          sanitizedValue = sanitizePhone(value);
          break;
        case "webAddress":
          sanitizedValue = sanitizeUrl(value);
          break;
        case "numberOfMembers":
          // Only allow digits for member count
          sanitizedValue = value.replace(/[^\d]/g, "");
          break;
        default:
          sanitizedValue = sanitizeText(value);
      }
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (
    field: "registrationForm" | "paymentReceipt",
    file: File | null
  ) => {
    if (file) {
      // Validate file
      if (!validateFile(file)) {
        toast.error("Invalid file. Please upload JPG, PNG, or PDF under 10MB");
        return;
      }

      // Show success toast
      const fileName =
        file.name.length > 30 ? `${file.name.substring(0, 27)}...` : file.name;
      toast.success(`📎 ${fileName} selected`, {
        duration: 2000,
      });

      // Show warning for large files
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("⚠️ Large file detected. Upload may take a moment.", {
          duration: 3000,
        });
      }
    }
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    if (!formData.registrationForm || !formData.paymentReceipt) {
      toast.error("Please upload both registration form and payment receipt");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Preparing registration...");

    try {
      // Step 1: Upload registration certificate
      toast.loading("Uploading registration certificate...");
      const certUploadUrl = await generateUploadUrl();
      const certResult = await fetch(certUploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.registrationForm.type },
        body: formData.registrationForm,
      });

      if (!certResult.ok) {
        throw new Error("Failed to upload registration certificate");
      }

      const { storageId: certStorageId } = await certResult.json();
      toast.success("Registration certificate uploaded!");

      // Step 2: Upload payment receipt
      toast.loading("Uploading payment receipt...");
      const receiptUploadUrl = await generateUploadUrl();
      const receiptResult = await fetch(receiptUploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.paymentReceipt.type },
        body: formData.paymentReceipt,
      });

      if (!receiptResult.ok) {
        throw new Error("Failed to upload payment receipt");
      }

      const { storageId: receiptStorageId } = await receiptResult.json();
      toast.success("Payment receipt uploaded!");

      // Step 3: Submit registration
      toast.loading("Submitting registration...");
      const established = `${formData.establishedYear}-${formData.establishedMonth.padStart(2, "0")}`;

      await registration({
        name: sanitizeTextForSubmit(formData.ministryName),
        registrationCertificate: certStorageId,
        paymentReceipt: receiptStorageId,
        established: established,
        numberOfMembers: parseInt(formData.numberOfMembers),
        email: sanitizeEmail(formData.email),
        phoneNumber: sanitizePhone(formData.phoneNo),
        websiteUrl: formData.webAddress
          ? sanitizeUrl(formData.webAddress)
          : undefined,
        address: sanitizeTextForSubmit(formData.address),
      });

      toast.dismiss();
      toast.success("✅ Registration submitted successfully!", {
        description: "Your application is now under review.",
        duration: 5000,
      });

      // Success - close modal and reset form
      setOpen(false);
      setErrors({});
      setFormData({
        ministryName: "",
        societyShortName: "",
        registrationForm: null,
        paymentReceipt: null,
        establishedMonth: "",
        establishedYear: "",
        numberOfMembers: "",
        email: "",
        phoneNo: "",
        webAddress: "",
        address: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.dismiss();
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit registration. Please try again.",
        {
          duration: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUpload = ({
    field,
    label,
    accept = "image/*,.pdf",
  }: {
    field: "registrationForm" | "paymentReceipt";
    label: string;
    accept?: string;
  }) => {
    const file = formData[field];

    return (
      <div className='space-y-2'>
        <Label htmlFor={field}>{label}</Label>
        {file ? (
          <div className='flex items-center justify-between p-3 border rounded-md bg-muted'>
            <div className='flex items-center space-x-2'>
              <Upload className='h-4 w-4' />
              <span className='text-sm truncate'>{file.name}</span>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => handleFileUpload(field, null)}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors'>
            <input
              type='file'
              id={field}
              accept={accept}
              onChange={(e) =>
                handleFileUpload(field, e.target.files?.[0] || null)
              }
              className='hidden'
            />
            <label htmlFor={field} className='cursor-pointer'>
              <Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>
                Click to upload {label.toLowerCase()}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                PNG, JPG, PDF up to 10MB
              </p>
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='lg'
          className='bg-primary hover:bg-primary/90 text-primary-foreground'>
          Register Your Cooperative
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle className='text-2xl font-bold'>
            FedCoop Registration Form
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Join our federation of cooperative societies. Fill out the form
            below to register your cooperative.
          </p>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto'>
          <form onSubmit={handleSubmit} className='space-y-6 py-4'>
            {/* Ministry/MDA Name */}
            <div className='space-y-2'>
              <Label htmlFor='ministryName' className='text-sm md:text-base'>
                Name of Ministry/MDA *
              </Label>
              {members === undefined ? (
                <div className='flex items-center gap-2 p-3 border rounded-md'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span className='text-xs md:text-sm text-muted-foreground'>
                    Loading members...
                  </span>
                </div>
              ) : members.length === 0 ? (
                <div className='p-3 border rounded-md text-xs md:text-sm text-muted-foreground'>
                  No members available. Please contact admin.
                </div>
              ) : (
                <Select
                  value={formData.ministryName}
                  onValueChange={(value) =>
                    handleInputChange("ministryName", value)
                  }>
                  <SelectTrigger
                    id='ministryName'
                    className={`w-full text-sm md:text-base ${
                      errors.ministryName ? "border-red-500" : ""
                    }`}>
                    <SelectValue placeholder='Select your organization' />
                  </SelectTrigger>
                  <SelectContent
                    className='max-h-[200px] md:max-h-[300px] overflow-y-auto'
                    position='popper'
                    sideOffset={5}>
                    {members
                      .map((member) => (
                        <SelectItem
                          key={member._id}
                          value={member.name}
                          className='text-sm md:text-base'>
                          <span className='truncate block max-w-[250px] md:max-w-[400px] capitalize'>
                            {member.name}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              {errors.ministryName && (
                <p className='text-xs md:text-sm text-red-500'>
                  {errors.ministryName}
                </p>
              )}
            </div>

            {/* File Uploads */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FileUpload
                field='registrationForm'
                label='Registration Form *'
              />
              <FileUpload field='paymentReceipt' label='Payment Receipt *' />
            </div>

            {/* When Established */}
            <div className='space-y-2'>
              <Label className='text-sm md:text-base'>When Established *</Label>
              <div className='grid grid-cols-2 gap-3 md:gap-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='establishedMonth'
                    className='text-xs md:text-sm'>
                    Month
                  </Label>
                  <Select
                    value={formData.establishedMonth}
                    onValueChange={(value) =>
                      handleInputChange("establishedMonth", value)
                    }>
                    <SelectTrigger className='text-sm md:text-base'>
                      <SelectValue placeholder='Select month' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px] md:max-h-[300px]'>
                      <SelectItem value='01' className='text-sm md:text-base'>
                        January
                      </SelectItem>
                      <SelectItem value='02' className='text-sm md:text-base'>
                        February
                      </SelectItem>
                      <SelectItem value='03' className='text-sm md:text-base'>
                        March
                      </SelectItem>
                      <SelectItem value='04' className='text-sm md:text-base'>
                        April
                      </SelectItem>
                      <SelectItem value='05' className='text-sm md:text-base'>
                        May
                      </SelectItem>
                      <SelectItem value='06' className='text-sm md:text-base'>
                        June
                      </SelectItem>
                      <SelectItem value='07' className='text-sm md:text-base'>
                        July
                      </SelectItem>
                      <SelectItem value='08' className='text-sm md:text-base'>
                        August
                      </SelectItem>
                      <SelectItem value='09' className='text-sm md:text-base'>
                        September
                      </SelectItem>
                      <SelectItem value='10' className='text-sm md:text-base'>
                        October
                      </SelectItem>
                      <SelectItem value='11' className='text-sm md:text-base'>
                        November
                      </SelectItem>
                      <SelectItem value='12' className='text-sm md:text-base'>
                        December
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='establishedYear'
                    className='text-xs md:text-sm'>
                    Year
                  </Label>
                  <Select
                    value={formData.establishedYear}
                    onValueChange={(value) =>
                      handleInputChange("establishedYear", value)
                    }>
                    <SelectTrigger className='text-sm md:text-base'>
                      <SelectValue placeholder='Select year' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px] md:max-h-60'>
                      {Array.from({ length: 50 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className='text-sm md:text-base'>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Number of Members */}
            <div className='space-y-2'>
              <Label htmlFor='numberOfMembers' className='text-sm md:text-base'>
                Number of Members *
              </Label>
              <Input
                id='numberOfMembers'
                type='number'
                placeholder='e.g., 150'
                value={formData.numberOfMembers}
                onChange={(e) =>
                  handleInputChange("numberOfMembers", e.target.value)
                }
                min='1'
                className='text-sm md:text-base'
                required
              />
            </div>

            {/* Contact Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm md:text-base'>
                  Email Address *
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='info@yourcoop.org'
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`text-sm md:text-base ${errors.email ? "border-red-500" : ""}`}
                  required
                />
                {errors.email && (
                  <p className='text-xs md:text-sm text-red-500'>
                    {errors.email}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phoneNo' className='text-sm md:text-base'>
                  Phone Number *
                </Label>
                <Input
                  id='phoneNo'
                  type='tel'
                  placeholder='+234-800-123-4567'
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  className={`text-sm md:text-base ${errors.phoneNo ? "border-red-500" : ""}`}
                  required
                />
                {errors.phoneNo && (
                  <p className='text-xs md:text-sm text-red-500'>
                    {errors.phoneNo}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className='space-y-2'>
              <Label htmlFor='webAddress' className='text-sm md:text-base'>
                Website Address
              </Label>
              <Input
                id='webAddress'
                type='url'
                placeholder='https://yourcoop.org'
                value={formData.webAddress}
                onChange={(e) =>
                  handleInputChange("webAddress", e.target.value)
                }
                className='text-sm md:text-base'
              />
              {errors.webAddress && (
                <p className='text-xs md:text-sm text-red-500'>
                  {errors.webAddress}
                </p>
              )}
            </div>

            {/* Address */}
            <div className='space-y-2'>
              <Label htmlFor='address' className='text-sm md:text-base'>
                Address *
              </Label>
              <Textarea
                id='address'
                placeholder="Enter your cooperative's full address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className={`text-sm md:text-base ${errors.address ? "border-red-500" : ""}`}
                required
              />
              {errors.address && (
                <p className='text-xs md:text-sm text-red-500'>
                  {errors.address}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className='flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className='w-full sm:w-auto text-sm md:text-base'>
                Cancel
              </Button>
              <Button
                type='submit'
                className='w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm md:text-base'
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
