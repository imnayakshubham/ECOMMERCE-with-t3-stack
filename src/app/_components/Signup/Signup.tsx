"use client";

import React, { useContext } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
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
    user_name: z.string().min(3).max(100).transform((value: string) => value.trim()),
    user_email: z.string().email().transform((value: string) => value.trim()),
    password: z.string().min(8).max(100)
        .refine((value) => { // No need to specify type for value as Zod infers it
            return value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/);
        }, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
        }).transform((value: string) => value.trim()),
    confirm_password: z.string().min(8).max(100)
        .transform((value: string) => value.trim())
}).superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
        return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirm_password'],
        });
    }
})

export const Signup = () => {
    const router = useRouter();
    const { setUser } = useContext(UserContext);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_name: undefined,
            user_email: undefined,
            password: undefined,
            confirm_password: undefined,
        },
    });

    const createUser = api.auth.signup.useMutation({
        onError: (error) => {
            console.error({ error });
        },
        onSuccess: (data) => {
            setUser(data)
            if (!data.is_verified) {
                router.push('/verify-email')
            }
        },
    });


    function onSubmit(data: z.infer<typeof formSchema>) {
        createUser.mutate({
            user_name: data.user_name,
            user_email: data.user_email,
            password: data.password,
        });
    }

    return (
        <div className='flex justify-center w-full'>
            <Card className='w-full md:w-[500px]'>
                <CardHeader>
                    <CardTitle className='font-inter text-2xl font-semibold leading-9 text-black text-center'>Create your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {createUser.error?.message &&
                            <Alert variant="destructive" className='p-1'>
                                <AlertDescription>
                                    {createUser.error?.message}
                                </AlertDescription>
                            </Alert>
                        }
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="user_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type='user_name' placeholder="Lorem Laura" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='Enter Password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' loading={createUser.isPending}>Submit</Button>
                        </form>
                    </Form>
                </CardContent >
                <CardFooter className='flex justify-center gap-1'>
                    <div>Have an Account? </div>
                    <Link className='text-blue-500' href={"/login"}>Login</Link>
                </CardFooter>
            </Card >
        </div>
    )
}
