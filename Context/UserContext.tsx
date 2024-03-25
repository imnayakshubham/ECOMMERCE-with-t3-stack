"use client";
import { getCookie, getCookies } from 'cookies-next';

import { createContext, useEffect, useMemo, useState } from 'react';
import { api } from '~/trpc/react';

export type UserType = {
    user_name: string;
    user_email: string;
    id: string;
    is_verified: boolean;
    is_admin: boolean;
}

export const UserContext = createContext({});
export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);

    const userInfo = api.auth.currentUser.useQuery()



    useEffect(() => {
        if (!userInfo.isPending && userInfo.data) {
            const data = (userInfo.data ?? null) as UserType
            setUser(data)
        }
    }, [userInfo])




    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}