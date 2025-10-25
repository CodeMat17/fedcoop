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
  name: string;
  certificate: File | null;
  paymentReceipt: File | null;
  email: string;
  phoneNo: string;
  webAddress: string;
  address: string;
}

const ActivateCooperativeModal = () => {
  const cooperatives = useQuery(api.cooperatives.getAllCooperatives);
  const activateCooperative = useMutation(api.cooperatives.activateCooperative);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    certificate: null,
    paymentReceipt: null,
    email: "",
    phoneNo: "",
    webAddress: "",
    address: "",
  });

  // Filter cooperatives to only show those with 'inactive' status
  const inactiveCooperatives = cooperatives?.filter(
    (coop) => coop.status === "inactive"
  );

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
    if (!formData.name.trim()) {
      newErrors.name = "Cooperative name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Cooperative name must be at least 2 characters";
    }

    if (!formData.certificate) {
      newErrors.certificate = "Certificate of incorporation is required";
    } else if (!validateFile(formData.certificate)) {
      newErrors.certificate =
        "Invalid file type or size (max 10MB, JPG/PNG/PDF only)";
    }

    if (!formData.paymentReceipt) {
      newErrors.paymentReceipt = "Payment receipt is required";
    } else if (!validateFile(formData.paymentReceipt)) {
      newErrors.paymentReceipt =
        "Invalid file type or size (max 10MB, JPG/PNG/PDF only)";
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
    } else if (formData.address.length < 5) {
      // Changed from 10 to 5 to match Convex validation
      newErrors.address = "Address must be at least 5 characters";
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
        case "name":
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
    field: "certificate" | "paymentReceipt",
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

    if (!formData.certificate || !formData.paymentReceipt) {
      toast.error(
        "Please upload both incorporation certificate and payment receipt"
      );
      return;
    }

    setIsSubmitting(true);
    toast.loading("Preparing activation...");

    try {
      // Step 1: Upload incorporation certificate
      toast.loading("Uploading incorporation certificate...");
      const certUploadUrl = await generateUploadUrl();
      const certResult = await fetch(certUploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.certificate.type },
        body: formData.certificate,
      });

      if (!certResult.ok) {
        throw new Error("Failed to upload incorporation certificate");
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

      // Step 3: Find the cooperative ID by name
      const selectedCooperative = cooperatives?.find(
        (coop) => coop.name === formData.name
      );

      if (!selectedCooperative) {
        throw new Error("Selected cooperative not found");
      }

      // Step 4: Activate the cooperative with all required fields
      toast.loading("Activating cooperative...");

      await activateCooperative({
        id: selectedCooperative._id,
        name: sanitizeTextForSubmit(formData.name),
        email: sanitizeEmail(formData.email),
        phoneNumber: sanitizePhone(formData.phoneNo),
        websiteUrl: formData.webAddress ? sanitizeUrl(formData.webAddress) : "", // Send empty string if no website
        address: sanitizeTextForSubmit(formData.address),
        certificate: certStorageId,
        paymentReceipt: receiptStorageId,
        // Note: status is automatically set to "processing" in the mutation
      });

      toast.dismiss();
      toast.success("✅ Cooperative activation submitted!", {
        description: "Your activation request is now under review.",
        duration: 5000,
      });

      // Success - close modal and reset form
      setOpen(false);
      setErrors({});
      setFormData({
        name: "",
        certificate: null,
        paymentReceipt: null,
        email: "",
        phoneNo: "",
        webAddress: "",
        address: "",
      });
    } catch (error) {
      console.error("Activation error:", error);
      toast.dismiss();
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit activation request. Please try again.",
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
    field: "certificate" | "paymentReceipt";
    label: string;
    accept?: string;
  }) => {
    const file = formData[field];

    return (
      <div className='space-y-2'>
        <Label htmlFor={field}>{label}</Label>
        {file ? (
          <div className='flex items-center justify-between p-3 border rounded-md bg-muted'>
            <div className='flex items-center space-x-2 truncate'>
              <Upload className='h-4 w-4 shrink-0' />
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
        {errors[field] && (
          <p className='text-xs text-red-500'>{errors[field]}</p>
        )}
      </div>
    );
  };

  // Helper function to get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", className: "text-green-600" };
      case "processing":
        return { label: "Processing", className: "text-yellow-600" };
      case "inactive":
        return { label: "Inactive", className: "text-gray-500" };
      default:
        return { label: "Unknown", className: "text-gray-500" };
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
          Continue
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle className='text-2xl font-bold'>
            FEDCOOP Activation Form
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Join our federation of cooperative societies. Fill out the form
            below to activate your cooperative society.
          </p>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto'>
          <form onSubmit={handleSubmit} className='space-y-6 py-4'>
            {/* Cooperative Name Selection */}
            <div className='space-y-2'>
              <Label htmlFor='cooperativeName' className='text-sm md:text-base'>
                Name of Cooperative *
              </Label>
              {cooperatives === undefined ? (
                <div className='flex items-center gap-2 p-3 border rounded-md'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span className='text-xs md:text-sm text-muted-foreground'>
                    Loading cooperatives...
                  </span>
                </div>
              ) : inactiveCooperatives?.length === 0 ? (
                <div className='p-3 border rounded-md text-xs md:text-sm text-muted-foreground'>
                  No inactive cooperatives available for activation. All
                  cooperatives are either processing or already active.
                </div>
              ) : (
                <Select
                  value={formData.name}
                  onValueChange={(value) => handleInputChange("name", value)}>
                  <SelectTrigger
                    id='cooperativeName'
                    className={`w-full text-sm md:text-base ${
                      errors.name ? "border-red-500" : ""
                    }`}>
                    <SelectValue placeholder='Select your cooperative' />
                  </SelectTrigger>
                  <SelectContent
                    className='max-h-[200px] md:max-h-[300px] overflow-y-auto'
                    position='popper'
                    sideOffset={5}>
                    {/* Show inactive cooperatives as selectable options */}
                    {inactiveCooperatives?.map((cooperative) => (
                      <SelectItem
                        key={cooperative._id}
                        value={cooperative.name}
                        className='text-sm md:text-base'>
                        <span className='truncate block max-w-[250px] md:max-w-[400px] capitalize'>
                          {cooperative.name}
                        </span>
                      </SelectItem>
                    ))}

                    {/* Show non-selectable options for active/processing cooperatives */}
                    {cooperatives
                      ?.filter((coop) => coop.status !== "inactive")
                      .map((cooperative) => (
                        <SelectItem
                          key={cooperative._id}
                          value={cooperative.name}
                          className='text-sm md:text-base opacity-50 cursor-not-allowed'
                          disabled>
                          <div className='flex justify-between items-center w-full'>
                            <span className='truncate block max-w-[180px] md:max-w-[330px] capitalize'>
                              {cooperative.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${getStatusInfo(cooperative.status).className} bg-opacity-20`}>
                              {getStatusInfo(cooperative.status).label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              {errors.name && (
                <p className='text-xs md:text-sm text-red-500'>{errors.name}</p>
              )}
            </div>

            {/* File Uploads */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FileUpload
                field='certificate'
                label='Certificate of Incorporation *'
              />
              <FileUpload
                field='paymentReceipt'
                label='Payment Receipt (₦50,000) *'
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
                disabled={isSubmitting || inactiveCooperatives?.length === 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  "Submit Activation"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivateCooperativeModal;
