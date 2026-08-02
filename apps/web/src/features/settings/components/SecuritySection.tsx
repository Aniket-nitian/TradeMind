import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, Pencil } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/features/auth/hooks";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function SecuritySection() {
  const [isEditing, setIsEditing] = useState(false);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          reset();
          setIsEditing(false);
        },
      }
    );
  });

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Card id="security">
      <CardHeader>
        <CardTitle>Password</CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KeyRound className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">••••••••••••</p>
                <p className="text-xs text-muted-foreground">
                  Change the password used to log in.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="size-4" />
              Change password
            </Button>
          </div>
        )}

        {isEditing && (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    {...register("currentPassword")}
                  />
                  <FieldError errors={[errors.currentPassword]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register("newPassword")}
                  />
                  <FieldError errors={[errors.newPassword]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                  />
                  <FieldError errors={[errors.confirmPassword]} />
                </Field>
              </div>
            </FieldGroup>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? "Changing…" : "Save password"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
