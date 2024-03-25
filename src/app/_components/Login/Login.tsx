"use client";

import React, { useContext } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { UserContext } from 'Context/UserContext';


const formSchema = z.object({
    user_email: z.string().email().transform((value: string) => value.trim()),
    password: z.string().min(8).max(100)
        .refine((value) => { // No need to specify type for value as Zod infers it
            return value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/);
        }, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
        }).transform((value: string) => value.trim()),
})

export const Login = () => {

    const router = useRouter();

    const { setUser } = useContext(UserContext);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_email: undefined,
            password: undefined,
        },
    });

    const loginUser = api.auth.login.useMutation({
        onSuccess: (data) => {
            if (data) {
                setUser(data)
                if (!data.is_verified) {
                    router.push('/verify-email')
                }
                router.push('/')
            }
        }

    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        if (loginUser) {
            loginUser.mutate(data)

        }
    }


    return (
        <div className='flex justify-center w-full'>
            <Card className='w-full md:w-[500px]'>
                <CardHeader>
                    <CardTitle className='font-inter text-2xl font-semibold leading-9 text-black text-center'>Login</CardTitle>
                    <CardDescription className='text-center font-inter text-base font-medium leading-7'>Welcome back to ECOMMERCE</CardDescription>
                    <CardDescription className='text-center font-inter text-base font-normal leading-5'>The next gen business marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {loginUser.error?.message &&
                            <Alert variant="destructive" className='p-1'>
                                <AlertDescription>
                                    {loginUser.error?.message}
                                </AlertDescription>
                            </Alert>
                        }
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="user_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='user_email' placeholder="example@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                            <Input type='password' placeholder='Enter Password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' loading={loginUser.isPending}>Submit</Button>
                        </form>
                    </Form>
                </CardContent >
                <CardFooter className='flex justify-center gap-1'>
                    <div>{`Don't have an Account?`}</div>
                    <Link className='text-blue-500' href={"/signup"}>Sign up</Link>
                </CardFooter>
            </Card >
        </div>
    )
}
