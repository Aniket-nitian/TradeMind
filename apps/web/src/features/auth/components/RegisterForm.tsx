import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useLogin, useRegister } from "../hooks";
import { GoogleAuthButton } from "./GoogleAuthButton";

const schema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const register_ = useRegister();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    register_.mutate(values, {
      onSuccess: () => {
        login.mutate(
          { email: values.email, password: values.password },
          { onSuccess: () => navigate("/dashboard") }
        );
      },
    });
  });

  const isPending = register_.isPending || login.isPending;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <Input
                id="firstName"
                autoComplete="given-name"
                className="h-11 rounded-xl px-3.5"
                {...register("firstName")}
              />
              <FieldError errors={[errors.firstName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
              <Input
                id="lastName"
                autoComplete="family-name"
                className="h-11 rounded-xl px-3.5"
                {...register("lastName")}
              />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="h-11 rounded-xl px-3.5"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl px-3.5"
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        <Button type="submit" disabled={isPending} className="h-11 rounded-xl text-base">
          {isPending ? "Creating account…" : "Create account"}
        </Button>

        <GoogleAuthButton />
      </form>
    </div>
  );
}
