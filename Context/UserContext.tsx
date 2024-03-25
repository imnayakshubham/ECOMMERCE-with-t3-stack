"use client";
import { createContext, useEffect, useState } from 'react';
import { api } from '~/trpc/react';

export type UserType = {
    user_name: string;
    user_email: string;
    id: string;
    is_verified: boolean;
    is_admin: boolean;
}
interface UserContextType {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { throw new Error("setUser must be implemented"); }
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);

    const userInfo = api.auth.currentUser.useQuery()



    useEffect(() => {
        if (!userInfo.isPending && userInfo.data) {
            setUser(userInfo.data)
        }
    }, [userInfo])




    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}