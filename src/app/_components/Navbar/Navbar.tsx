"use client"

import { UserContext } from 'Context/UserContext';
import Link from 'next/link';
import React, { useContext } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { getCurrentUser } from '~/lib/utils';
import { api } from '~/trpc/react';

export const SearchIcon = () => {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5145 24.4587L20.8214 19.7656C22.1843 18.131 22.8646 16.0338 22.7206 13.9104C22.5767 11.7871 21.6197 9.8009 20.0486 8.36517C18.4776 6.92944 16.4135 6.15468 14.2858 6.20206C12.158 6.24945 10.1305 7.11532 8.62492 8.61957C7.11935 10.1238 6.25168 12.1506 6.20241 14.2783C6.15315 16.406 6.92609 18.4707 8.36043 20.0431C9.79477 21.6154 11.7801 22.5742 13.9033 22.72C16.0266 22.8658 18.1243 22.1874 19.7601 20.8259L24.4533 25.5199C24.5229 25.5896 24.6057 25.6449 24.6967 25.6826C24.7878 25.7203 24.8853 25.7397 24.9839 25.7397C25.0824 25.7397 25.18 25.7203 25.2711 25.6826C25.3621 25.6449 25.4448 25.5896 25.5145 25.5199C25.5842 25.4503 25.6395 25.3675 25.6772 25.2765C25.7149 25.1854 25.7343 25.0879 25.7343 24.9893C25.7343 24.8908 25.7149 24.7932 25.6772 24.7021C25.6395 24.6111 25.5842 24.5284 25.5145 24.4587ZM7.73388 14.4893C7.73388 13.1543 8.12977 11.8492 8.87146 10.7392C9.61316 9.62919 10.6674 8.76402 11.9008 8.25313C13.1342 7.74224 14.4914 7.60857 15.8007 7.86902C17.1101 8.12947 18.3129 8.77234 19.2569 9.71635C20.2009 10.6604 20.8437 11.8631 21.1042 13.1725C21.3646 14.4818 21.231 15.839 20.7201 17.0724C20.2092 18.3058 19.344 19.36 18.234 20.1017C17.124 20.8434 15.8189 21.2393 14.4839 21.2393C12.6943 21.2373 10.9785 20.5255 9.71311 19.2601C8.44767 17.9947 7.73587 16.2789 7.73388 14.4893Z" fill="#333333" />
        </svg>

    )
}

export const CartIcon = () => {

    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 24.25C14 24.5467 13.912 24.8367 13.7472 25.0834C13.5824 25.33 13.3481 25.5223 13.074 25.6358C12.7999 25.7494 12.4983 25.7791 12.2074 25.7212C11.9164 25.6633 11.6491 25.5204 11.4393 25.3107C11.2296 25.1009 11.0867 24.8336 11.0288 24.5426C10.9709 24.2517 11.0006 23.9501 11.1142 23.676C11.2277 23.4019 11.42 23.1676 11.6666 23.0028C11.9133 22.838 12.2033 22.75 12.5 22.75C12.8978 22.75 13.2794 22.908 13.5607 23.1893C13.842 23.4706 14 23.8522 14 24.25ZM22.25 22.75C21.9533 22.75 21.6633 22.838 21.4166 23.0028C21.17 23.1676 20.9777 23.4019 20.8642 23.676C20.7506 23.9501 20.7209 24.2517 20.7788 24.5426C20.8367 24.8336 20.9796 25.1009 21.1893 25.3107C21.3991 25.5204 21.6664 25.6633 21.9574 25.7212C22.2483 25.7791 22.5499 25.7494 22.824 25.6358C23.0981 25.5223 23.3324 25.33 23.4972 25.0834C23.662 24.8367 23.75 24.5467 23.75 24.25C23.75 23.8522 23.592 23.4706 23.3107 23.1893C23.0294 22.908 22.6478 22.75 22.25 22.75ZM26.7172 10.9703L24.0425 19.6619C23.9024 20.1226 23.6175 20.5259 23.2301 20.812C22.8427 21.0981 22.3734 21.2517 21.8919 21.25H12.8816C12.3931 21.2482 11.9184 21.0882 11.5285 20.7939C11.1386 20.4997 10.8545 20.087 10.7188 19.6178L7.32687 7.75H5.75C5.55109 7.75 5.36032 7.67098 5.21967 7.53033C5.07902 7.38968 5 7.19891 5 7C5 6.80109 5.07902 6.61032 5.21967 6.46967C5.36032 6.32902 5.55109 6.25 5.75 6.25H7.32687C7.65257 6.25108 7.96916 6.35761 8.22925 6.55365C8.48934 6.74969 8.67895 7.0247 8.76969 7.3375L9.53 10H26C26.1174 9.99996 26.2331 10.0275 26.3379 10.0803C26.4427 10.1331 26.5336 10.2098 26.6034 10.3042C26.6732 10.3986 26.7198 10.508 26.7396 10.6237C26.7593 10.7394 26.7517 10.8581 26.7172 10.9703ZM24.9847 11.5H9.95844L12.1606 19.2062C12.2054 19.3629 12.3 19.5007 12.4301 19.5988C12.5602 19.6969 12.7186 19.75 12.8816 19.75H21.8919C22.0524 19.7501 22.2086 19.6986 22.3377 19.6033C22.4668 19.508 22.5619 19.3737 22.6091 19.2203L24.9847 11.5Z" fill="#333333" />
        </svg>

    )
}

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const logout = api.auth.logout.useMutation({})

    const { user } = useContext(UserContext);

    const handleLogout = () => {
        logout.mutate()
    }



    return (
        <nav className="fixed w-full z-20 top-0 start-0 border-b border-gray-200 p-1 px-2 md:px-6 bg-[#FFFFFF] h-[90px]">
            <div className='flex justify-end gap-4 w-full py-2 md:gap-2 items-center'>
                <div className='link font-inter font-normal text-base md:text-sm text-gray-700'>
                    <Link href='/help' className='w-full'>Help</Link>
                </div>
                <div className='link font-inter font-normal text-base md:text-sm text-gray-700 w-fit'>
                    <Link href='/orders' className='w-full'>Orders & Returns</Link>
                </div>
                {!!Object.keys(user ?? {}).length && <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className='user_profile cursor-pointer font-inter font-normal text-base md:text-sm text-gray-700'>
                            Hi, John
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                }
            </div>
            <div className="flex items-center justify-between w-full">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="font-inter text-2xl font-bold leading-10 text-left text-black">ECOMMERCE</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0">
                    <div className='flex gap-2 items-center md:gap-4'>
                        <div className='cursor-pointer'>
                            <SearchIcon />
                        </div>
                        <div className='cursor-pointer'>
                            <CartIcon />
                        </div>
                    </div>
                    <div>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex m-0 items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false" onClick={() => setIsOpen((prev) => !prev)}>
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5 m-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={`items-center ${isOpen ? '' : "hidden"} justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0   md:flex">
                        <li>
                            <a href="#" className="font-inter text-base font-semibold text-left text-black" aria-current="page">Categories</a>
                        </li>
                        <li>
                            <a href="#" className="font-inter text-base font-semibold text-left text-black">Sale</a>
                        </li>
                        <li>
                            <a href="#" className="font-inter text-base font-semibold text-left text-black  md:p-0">Clearance</a>
                        </li>
                        <li>
                            <a href="#" className="font-inter text-base font-semibold text-left text-black  md:p-0">New stock</a>
                        </li>
                        <li>
                            <a href="#" className="font-inter text-base font-semibold text-left text-black  md:p-0">Trending</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}
