"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Edit, Home, Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const HeroPage = () => {
  const hero = useQuery(api.hero.getHero);
  const updateHero = useMutation(api.hero.updateHero);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when data loads or editing starts
  const startEditing = () => {
    if (hero) {
      setTitle(hero.title);
      setSubtitle(hero.subtitle);
      setEditing(true);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setTitle("");
    setSubtitle("");
  };

  const handleUpdateHero = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subtitle.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateHero({
        title: title.trim(),
        subtitle: subtitle.trim(),
      });
      toast.success("Hero content updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating hero:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update hero content. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hero === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='py-12'>
      <div className='pb-4'>
        <div className='flex items-center justify-between'>
        <h2 className="text-3xl font-bold text-foreground">Hero Section</h2>
          {!editing && (
            <Button
              variant='outline'
              size='sm'
              onClick={startEditing}
              className='flex items-center space-x-2'>
              <Edit className='w-4 h-4' />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>
      <div>
        {editing ? (
          <form onSubmit={handleUpdateHero} className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='hero-title' className='text-sm font-medium'>
                  Main Title *
                </Label>
                <Input
                  id='hero-title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter the main title for your hero section'
                  className='text-base font-semibold'
                  maxLength={300}
                />
               
              </div>

              <div className='space-y-2'>
                <Label htmlFor='hero-subtitle' className='text-sm font-medium'>
                  Subtitle *
                </Label>
                <Textarea
                  id='hero-subtitle'
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder='Enter a compelling description for your organization'
                  rows={3}
                  className='text-base resize-none leading-relaxed'
                  maxLength={500}
                />
               
              </div>
            </div>

            <div className='flex space-x-3 pt-4 border-t'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='flex items-center space-x-2'>
                {isSubmitting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={cancelEditing}
                disabled={isSubmitting}
                className='flex items-center space-x-2'>
                <X className='w-4 h-4' />
                <span>Cancel</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className='space-y-6'>
            {/* Preview Section */}
            <div className='space-y-4'>
              <div className='p-4 bg-muted/30 rounded-lg border'>
                <h3 className='text-sm font-medium text-muted-foreground mb-3'>
                  Preview
                </h3>
                <div className='space-y-3'>
                  <h2 className='text-2xl md:text-3xl font-bold text-foreground leading-tight'>
                    {hero.title}
                  </h2>
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    {hero.subtitle}
                  </p>
                </div>
              </div>

           
            </div>

          
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroPage;
