import { z } from "zod";

export const userSignUpSchema = z.object({
  firstName: z.string().min(1, { message: "firstName Required" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least chars long" })
    .regex(/[A-Z]/, {
      message: "Password must contain atleast one upperCase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain atleast one lowerCase letter",
    })
    .regex(/[\W_]/, {
      message: "Password must contain atleast one special char",
    }),
});

export type SignUpBody = z.infer<typeof userSignUpSchema>;
