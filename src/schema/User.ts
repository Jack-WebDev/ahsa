import { z } from "zod";

export enum Gender {
  Male = "Male",
  Female = "Female",
  NonBinary = "NonBinary",
  Other = "Other",
}

export enum Role {
  Admin = "Admin",
  Applicant = "Applicant",
}
export enum Province {
  Mpumalanga = "Mpumalanga",
  KwaZuluNatal = "KwaZuluNatal",
  FreeState = "FreeState",
  Gauteng = "Gauteng",
  Limpopo = "Limpopo",
  NorthWest = "NorthWest",
  NorthernCape = "NorthernCape",
  WesternCape = "WesternCape",
  EasternCape = "EasternCape",
  Unknown = "Unknown",
}

export enum Title {
  Mr = "Mr",
  Mrs = "Mrs",
  Ms = "Ms",
  Dr = "Dr",
  Prof = "Prof",
  Other = "Other",
}

export enum Ethnicity {
  White = "White",
  Mixed = "Mixed",
  Asian = "Asian",
  Black = "Black",
  Other = "Other",
}

export enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

export enum EmploymentStatus {
  Employed = "Employed",
  SelfEmployed = "SelfEmployed",
  Unemployed = "Unemployed",
}

export enum EducationLevel {
  Primary = "Primary",
  Secondary = "Secondary",
  Higher = "Higher",
  University = "University",
  Other = "Other",
}

export enum EmploymentType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Contract = "Contract",
  Freelance = "Freelance",
  Internship = "Internship",
  Other = "Other",
}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string(),
  idNumber: z.string(),
  dateOfBirth: z.string(),
  ethnicity: z.nativeEnum(Ethnicity),
  gender: z.nativeEnum(Gender),
  title: z.nativeEnum(Title),
  province: z.nativeEnum(Province),
});


export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;