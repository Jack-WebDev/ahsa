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
import Loader from "~/components/Loader";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values);
    setInterval(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.back();
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-4 bg-gray-100">
      <div className="grid gap-y-8 rounded-xl bg-white p-8 lg:w-1/3">
        <div className="flex flex-col text-start">
          <span className="text-xs font-semibold md:text-lg">
            Forgot Password?
          </span>
          <p>We need your email to reset your password</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="jack@example.com" {...field} />
                  </FormControl>

                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid gap-y-4">
                <Button type="submit" className="w-full">
                  Get Recovery Link
                </Button>
                <Button
                  variant={"link"}
                  className="w-full"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
