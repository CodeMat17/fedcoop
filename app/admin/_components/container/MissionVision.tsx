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
import { Edit, Eye, Loader2, Save, Target, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MissionVision = () => {
  const mission = useQuery(api.missionVision.getMission);
  const vision = useQuery(api.missionVision.getVision);
  const updateMission = useMutation(api.missionVision.updateMission);
  const updateVision = useMutation(api.missionVision.updateVision);

  const [editingMission, setEditingMission] = useState(false);
  const [editingVision, setEditingVision] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionBody, setMissionBody] = useState("");
  const [visionTitle, setVisionTitle] = useState("");
  const [visionBody, setVisionBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when data loads or editing starts
  const startEditingMission = () => {
    if (mission) {
      setMissionTitle(mission.title);
      setMissionBody(mission.body);
      setEditingMission(true);
    }
  };

  const startEditingVision = () => {
    if (vision) {
      setVisionTitle(vision.title);
      setVisionBody(vision.body);
      setEditingVision(true);
    }
  };

  const cancelEditingMission = () => {
    setEditingMission(false);
    setMissionTitle("");
    setMissionBody("");
  };

  const cancelEditingVision = () => {
    setEditingVision(false);
    setVisionTitle("");
    setVisionBody("");
  };

  const handleUpdateMission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!missionTitle.trim() || !missionBody.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMission({
        title: missionTitle,
        body: missionBody,
      });
      toast.success("Mission updated successfully!");
      setEditingMission(false);
    } catch (error) {
      console.error("Error updating mission:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update mission. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVision = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visionTitle.trim() || !visionBody.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateVision({
        title: visionTitle,
        body: visionBody,
      });
      toast.success("Vision updated successfully!");
      setEditingVision(false);
    } catch (error) {
      console.error("Error updating vision:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update vision. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mission === undefined || vision === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='space-y-8 pt-8 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-foreground'>Mission & Vision</h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Our guiding principles that drive FEDCOOP forward
        </p>
      </div>

      {/* Mission Card */}
      <Card className='border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
          
            {!editingMission && (
              <Button
                variant='outline'
                size='sm'
                onClick={startEditingMission}
                className='flex items-center space-x-2'>
                <Edit className='w-4 h-4' />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingMission ? (
            <form onSubmit={handleUpdateMission} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='mission-title' className='text-sm font-medium'>
                  Mission Title
                </Label>
                <Input
                  id='mission-title'
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder='Enter mission title'
                  className='text-base'
                  maxLength={200}
                />
                <p className='text-xs text-muted-foreground'>
                  {missionTitle.length}/200 characters
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='mission-body' className='text-sm font-medium'>
                  Mission Statement
                </Label>
                <Textarea
                  id='mission-body'
                  value={missionBody}
                  onChange={(e) => setMissionBody(e.target.value)}
                  placeholder="Describe your organization's mission"
                  rows={4}
                  className='text-base resize-none'
                  maxLength={1000}
                />
                <p className='text-xs text-muted-foreground'>
                  {missionBody.length}/1000 characters
                </p>
              </div>
              <div className='flex space-x-2 pt-2'>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex items-center space-x-2'>
                  {isSubmitting ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Save className='w-4 h-4' />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Mission"}</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={cancelEditingMission}
                  disabled={isSubmitting}
                  className='flex items-center space-x-2'>
                  <X className='w-4 h-4' />
                  <span>Cancel</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-foreground'>
                {mission.title}
              </h3>
              <p className='text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                {mission.body}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vision Card */}
      <Card className='border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
          
            {!editingVision && (
              <Button
                variant='outline'
                size='sm'
                onClick={startEditingVision}
                className='flex items-center space-x-2'>
                <Edit className='w-4 h-4' />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingVision ? (
            <form onSubmit={handleUpdateVision} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='vision-title' className='text-sm font-medium'>
                  Vision Title
                </Label>
                <Input
                  id='vision-title'
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  placeholder='Enter vision title'
                  className='text-base'
                  maxLength={200}
                />
                <p className='text-xs text-muted-foreground'>
                  {visionTitle.length}/200 characters
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='vision-body' className='text-sm font-medium'>
                  Vision Statement
                </Label>
                <Textarea
                  id='vision-body'
                  value={visionBody}
                  onChange={(e) => setVisionBody(e.target.value)}
                  placeholder="Describe your organization's vision"
                  rows={4}
                  className='text-base resize-none'
                  maxLength={1000}
                />
                <p className='text-xs text-muted-foreground'>
                  {visionBody.length}/1000 characters
                </p>
              </div>
              <div className='flex space-x-2 pt-2'>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex items-center space-x-2'>
                  {isSubmitting ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Save className='w-4 h-4' />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Vision"}</span>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={cancelEditingVision}
                  disabled={isSubmitting}
                  className='flex items-center space-x-2'>
                  <X className='w-4 h-4' />
                  <span>Cancel</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-foreground'>
                {vision.title}
              </h3>
              <p className='text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                {vision.body}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className='bg-muted/50 border-dashed'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-2'>
            <h4 className='font-semibold text-foreground'>
              Editing Instructions
            </h4>
            <p className='text-sm text-muted-foreground'>
              Click the Edit button to update your mission and vision
              statements. These statements represent your organization&apos;s core
              purpose and future aspirations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionVision;
