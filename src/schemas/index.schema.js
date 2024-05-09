const z = require('zod');

const authLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

const authSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber: z.string().min(1),
})

module.exports = {
    authLoginSchema,
    authSignupSchema,
};