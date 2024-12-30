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
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Ethnicity, Gender, Province, Title } from "~/schema/User";
import { Textarea } from "~/components/ui/textarea";
import Image from "next/image";
import { clientApi } from "~/trpc/react";
import { toast } from "react-toastify";

const formSchema = z
  .object({
    title: z.nativeEnum(Title),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    surname: z.string().min(1, {
      message: "Surname is required",
    }),
    gender: z.nativeEnum(Gender),
    idNumber: z.string().min(1, {
      message: "ID Number is required",
    }),
    phoneNumber: z.string().min(1, {
      message: "Phone Number is required",
    }),
    ethnicity: z.nativeEnum(Ethnicity),
    email: z.string().email({
      message: "Invalid email address",
    }),
    province: z.nativeEnum(Province),
    dateOfBirth: z
    .string().min(1,{message: "Date of birth is required"})
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "Date of Birth must be in the format YYYY-MM-DD"
    ),
    password: z.string().min(5, {
      message: "Password must be at least 5 characters",
    }),
    confirmPassword: z.string(),
    address: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: Title.Other,
      name: "",
      surname: "",
      gender: Gender.Other,
      dateOfBirth: "",
      email: "",
      password: "",
      ethnicity: Ethnicity.Other,
      idNumber: "",
      phoneNumber: "",
      confirmPassword: "",
      address: "",
      province: Province.Unknown,
    },
  });

  const registerMutation = clientApi.user.register.useMutation({
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message)
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);



    registerMutation.mutate(values);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <div className="mx-auto grid w-full gap-y-6 rounded-xl bg-white p-8 shadow-lg md:w-3/4 lg:w-1/2">
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title and Name Fields */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Title
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Title).map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jack"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          {/* Surname and Email Fields */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6">
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Surname
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mbulazi"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jack@mail.com"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          {/* Gender and Ethnicity Fields */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Gender
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Gender).map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ethnicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Ethnicity
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your ethnicity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Ethnicity).map((ethnicity) => (
                        <SelectItem key={ethnicity} value={ethnicity}>
                          {ethnicity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          {/* Date of Birth and ID Number Fields */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6">
          <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Date of Birth (YYYY-MM-DD)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YYYY-MM-DD"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    ID Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="9087676545432"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="5644321231"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Province
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your ethnicity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Province).map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          {/* Phone Number and Address Fields */}
          <div className="grid grid-cols-1 gap-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Home Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="18753 Jack Avenue"
                      className="resize-none rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6">
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
                      placeholder="********"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage style={{ color: "red" }} />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex flex-col gap-y-4">
              <Button
                type="submit"
                className="w-full rounded-md bg-primary py-3 font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-primary"
              >
                Register
              </Button>
              <Button
                variant="link"
                className="w-full text-primary hover:underline"
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
