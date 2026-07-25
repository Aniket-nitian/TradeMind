import { useEffect, useRef, useState } from "react";
import { Camera, Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useUpdateProfile, useUploadAvatar } from "../hooks";
import type { UserProfile } from "../types";

export function ProfileSection({ profile }: { profile: UserProfile }) {
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName ?? "");
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
  }, [profile]);

  const initials = profile.firstName[0]?.toUpperCase() ?? "?";

  const handleSave = () => {
    updateProfile.mutate(
      { firstName, lastName, username: username || undefined, bio, avatarUrl: avatarUrl || undefined },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-14">
              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.firstName} />}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              aria-label="Change photo"
              disabled={uploadAvatar.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card disabled:opacity-50"
            >
              <Camera className="size-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar.mutate(file);
                e.target.value = "";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {profile.firstName} {profile.lastName}
              </span>
              <Badge variant={profile.subscription === "PREMIUM" ? "default" : "secondary"}>
                {profile.subscription}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground">
              Member since {formatDate(profile.createdAt)}
            </p>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="size-4" />
              Edit profile
            </Button>
          )}
        </div>

        {isEditing && (
          <>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="avatarUrl">Avatar URL (or use the camera icon above)</FieldLabel>
                  <Input
                    id="avatarUrl"
                    placeholder="https://…"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
              </Field>
            </FieldGroup>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button disabled={updateProfile.isPending} onClick={handleSave}>
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
