"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Shield,
  BookOpen,
  Leaf,
  Building2,
  Target,
  HeartHandshake,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import React from "react";

// Available icons for about features with proper typing
const availableIcons = [
  "Users",
  "Shield",
  "BookOpen",
  "Leaf",
  "Building2",
  "Target",
  "HeartHandshake",
  "TrendingUp",
] as const;

type IconName = (typeof availableIcons)[number];

// Map icon names to actual components with proper typing
const iconMap: Record<IconName, LucideIcon> = {
  Users: Users,
  Shield: Shield,
  BookOpen: BookOpen,
  Leaf: Leaf,
  Building2: Building2,
  Target: Target,
  HeartHandshake: HeartHandshake,
  TrendingUp: TrendingUp,
};

// Form state interfaces
interface AboutFormState {
  tagline: string;
  description: string;
}

interface FeatureFormState {
  title: string;
  description: string;
  iconName: IconName;
  order: number;
}

// Complete feature interface based on your schema
interface AboutFeature {
  _id: Id<"aboutFeatures">;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

const AboutEditor = () => {
  const about = useQuery(api.about.getAbout);
  const aboutFeatures = useQuery(api.about.getAboutFeatures);
  const updateAbout = useMutation(api.about.updateAbout);
  const updateAboutFeature = useMutation(api.about.updateAboutFeature);
  const initializeAboutFeatures = useMutation(
    api.about.initializeAboutFeatures
  );

  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutForm, setAboutForm] = useState<AboutFormState>({
    tagline: "",
    description: "",
  });

  const [editingFeatures, setEditingFeatures] = useState<string | null>(null);
  const [featureForm, setFeatureForm] = useState<FeatureFormState>({
    title: "",
    description: "",
    iconName: "Users",
    order: 0,
  });

  // Initialize features if they don't exist
  useEffect(() => {
    if (aboutFeatures && aboutFeatures.length === 0) {
      initializeAboutFeatures().catch(console.error);
    }
  }, [aboutFeatures, initializeAboutFeatures]);

  const startEditingAbout = () => {
    if (about) {
      setAboutForm({
        tagline: about.tagline || "",
        description: about.description,
      });
      setEditingAbout(true);
    }
  };

  const handleSaveAbout = async (): Promise<void> => {
    try {
      await updateAbout(aboutForm);
      toast.success("About section updated successfully!");
      setEditingAbout(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update about section";
      toast.error(errorMessage);
    }
  };

  const handleSaveAboutFeature = async (featureId: string): Promise<void> => {
    try {
      await updateAboutFeature({
        ...featureForm,
        id: featureId as Id<"aboutFeatures">,
      });
      toast.success("Feature updated successfully!");
      setEditingFeatures(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update feature";
      toast.error(errorMessage);
    }
  };

  // Get icon component from name with proper typing
  const getIconComponent = (iconName: IconName): React.JSX.Element => {
    const IconComponent = iconMap[iconName];
    return <IconComponent className='w-4 h-4 text-primary' />;
  };

  if (about === undefined || aboutFeatures === undefined) {
    return <AboutEditorSkeleton />;
  }

  return (
    <div className='space-y-8'>
      {/* About Section Editor */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            About Section
            {!editingAbout && (
              <Button variant='outline' size='sm' onClick={startEditingAbout}>
                <Edit className='w-4 h-4 mr-2' />
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingAbout ? (
            <div className='space-y-4'>
              <div>
                <Label>Tagline (bold text) - Optional</Label>
                <Input
                  value={aboutForm.tagline}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAboutForm({ ...aboutForm, tagline: e.target.value })
                  }
                  placeholder='FEDCOOP (optional)'
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Leave empty if you don&apos;t want a bold tagline
                </p>
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={aboutForm.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setAboutForm({ ...aboutForm, description: e.target.value })
                  }
                  placeholder='Description text...'
                  rows={4}
                />
              </div>
              <div className='flex space-x-2'>
                <Button onClick={handleSaveAbout}>
                  <Save className='w-4 h-4 mr-2' />
                  Save
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setEditingAbout(false)}>
                  <X className='w-4 h-4 mr-2' />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <p>
                <strong>Tagline:</strong> {about.tagline || "Not set"}
              </p>
              <p>
                <strong>Description:</strong> {about.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About Features Editor */}
      <div>
        <div>
          <CardTitle>About Features ({aboutFeatures.length})</CardTitle>
        </div>
        <div className="mt-4">
          <div className='space-y-4'>
            {/* Existing About Features */}
            {aboutFeatures.map((feature: AboutFeature) => {
              const featureId = feature._id;

              return (
                <div key={featureId} className='border rounded-lg p-4'>
                  {editingFeatures === featureId ? (
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div>
                          <Label>Title *</Label>
                          <Input
                            value={featureForm.title}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setFeatureForm({
                                ...featureForm,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Icon *</Label>
                          <Select
                            value={featureForm.iconName}
                            onValueChange={(value: IconName) =>
                              setFeatureForm({
                                ...featureForm,
                                iconName: value,
                              })
                            }>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder='Select an icon' />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  <div className='flex items-center space-x-2'>
                                    {getIconComponent(icon)}
                                    <span>{icon}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea
                          value={featureForm.description}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) =>
                            setFeatureForm({
                              ...featureForm,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          size='sm'
                          onClick={() => handleSaveAboutFeature(featureId)}>
                          Save Changes
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setEditingFeatures(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className=''>
                      <div className='flex items-center justify-between'>
                        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                          {getIconComponent(feature.iconName as IconName)}
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-xs text-muted-foreground'>
                            Order: {feature.order}
                          </span>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setEditingFeatures(featureId);
                              setFeatureForm({
                                title: feature.title,
                                description: feature.description,
                                iconName: feature.iconName as IconName,
                                order: feature.order,
                              });
                            }}>
                            <Edit className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>

                      <div className='mt-3'>
                        <h4 className='font-semibold'>{feature.title}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutEditorSkeleton: React.FC = () => {
  return (
    <div className='space-y-8'>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
        </CardHeader>
        <CardContent className='space-y-4'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-16 w-full' />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutEditor;
