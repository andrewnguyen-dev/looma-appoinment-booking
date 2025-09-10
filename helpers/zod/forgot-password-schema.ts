import { z } from "zod";

const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
});

export default ForgotPasswordSchema;