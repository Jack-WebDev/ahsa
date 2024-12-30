"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import Loader from "~/components/Loader";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters",
  }),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="mx-auto grid gap-y-6 rounded-xl bg-white p-8 shadow-lg lg:w-1/3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-800 md:text-xl">
          Affordable Housing South Africa
        </span>
        <Image
          src="/logo.webp"
          alt="logo"
          width={50}
          height={50}
          className="rounded-xl"
        />
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="jack@example.com"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage style={{ color: "red" }} />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    type="password"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage style={{ color: "red" }} />
              </FormItem>
            )}
          />

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          {isLoading ? (
            <Loader />
          ) : (
            <Button
              type="submit"
              className="w-full rounded-md bg-primary py-3 font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-primary"
            >
              Login
            </Button>
          )}
        </form>
      </Form>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
