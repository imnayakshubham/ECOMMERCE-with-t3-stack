import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

import type { NextRequest } from 'next/server'
import type { UserType } from "Context/UserContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const secretKey = process.env.JWT_SECRETKEY ?? "secret";
const key = new TextEncoder().encode(secretKey);
const jwtAlgorithm = process.env.JWT_ALGORITHM ?? "HS256";


type EncryptPayloadType = {
  user: {
    id: string;
    user_email: string;
    user_name: string;
  }
  expires: number;

}

export async function encrypt(payload: EncryptPayloadType) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: jwtAlgorithm })
    .setIssuedAt()
    .setExpirationTime("30 days")
    .sign(key);
}

export async function decrypt(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: [jwtAlgorithm],
  });
  return payload;
}

export const createSession = async (user: UserType) => {
  const expires = 30 * 24 * 60 * 60 * 1000;
  const session = await encrypt({ user, expires });
  return {
    session,
    expires,
  }
}

export const getSession = async (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  return parsed;
}

export const getUserInfo = async (request: NextRequest) => {
  const userInfo = await getSession(request);
  return (userInfo?.user as UserType) ?? null;
}


export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);

  if (parsed) {
    parsed.expires = 30 * 24 * 60 * 60 * 1000;
    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt({ user: parsed.user as UserType, expires: parsed.expires as number }),
      httpOnly: true,
      expires: parsed.expires as number,
    });
    return res;
  } else {
    return NextResponse.next();
  }
}

export const getCurrentUser = async () => {
  // const cookieStore = cookies()
  // console.log(cookieStore)


  //   const user = await getUserInfo(request);
  //   return user;
}