"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "~/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { useContext } from "react"
import { UserContext } from "Context/UserContext"

const FormSchema = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function VerifyEmail() {

    const { user } = useContext(UserContext)

    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    })

    const verifyEmail = api.auth.verifyEmail.useMutation({
        onSuccess: (data) => {
            if (data?.is_verified) {
                router.push("/")
            }
        },
        onError: (error) => {
            console.error(error)
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        verifyEmail.mutate(data)
    }

    const autoSubmit = () => {
        if (form.getValues().otp.length === 8) {
            onSubmit(form.getValues())
        }
    }

    const otpMaxLength = 8

    return (
        <div className='flex justify-center w-full'>
            <Card className='w-full md:w-[500px]'>
                <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="text-center">Verify your email</CardTitle>
                    <CardDescription className="text-center">
                        Enter the 8 digit code you have received on
                        {user?.user_email}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3  sm:p-6 pt-0" >
                    <Form {...form} >
                        {verifyEmail.error?.message &&
                            <Alert variant="destructive" className='p-1'>
                                <AlertDescription>
                                    {verifyEmail.error?.message}
                                </AlertDescription>
                            </Alert>
                        }
                        <form onChange={autoSubmit} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={otpMaxLength} {...field}>
                                                <InputOTPGroup className="w-full">
                                                    {Array.from({ length: otpMaxLength }).map((_, index) => (
                                                        <InputOTPSlot key={index} index={index} className="w-full" />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit" disabled={verifyEmail.isPending} loading={verifyEmail.isPending}>Verify</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}
