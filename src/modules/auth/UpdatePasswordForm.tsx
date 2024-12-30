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

const formSchema = z
  .object({
    password: z.string().min(5, {
      message: "Password must be at least 5 characters",
    }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords must match",
      });
    }
  });

export default function UpdatePasswordForm({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values, email);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="mx-auto grid gap-y-6 rounded-xl bg-white p-8 shadow-lg lg:w-1/3">
      <div className="flex flex-col items-center">
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
          Create Your New Password
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter and confirm your new password below to reset your account.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter new password"
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    type="password"
                  />
                </FormControl>
                <FormMessage style={{ color: "red" }} />
              </FormItem>
            )}
          />
          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm new password"
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    type="password"
                  />
                </FormControl>
                <FormMessage style={{ color: "red" }} />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                className="w-full rounded-md bg-primary py-3 font-semibold text-white hover:bg-primary-foreground focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Create New Password
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
