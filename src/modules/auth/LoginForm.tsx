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
    <div className="grid gap-y-4 lg:w-1/3 mx-auto bg-white p-8 rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-lg font-semibold">Affordable Housing South Africa</span>
        <span>LOGO</span>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" {...field} />
                </FormControl>

                <FormMessage style={{ color: "red" }} />
              </FormItem>
            )}
          />
          
          {isLoading ? <Loader /> : <Button type="submit" className="w-full">Login</Button>}
        </form>
      </Form>
    </div>
  );
}
