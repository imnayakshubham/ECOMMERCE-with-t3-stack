"use client"

import React, { useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Alert } from '~/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Skeleton } from '~/components/ui/skeleton';
import { api } from '~/trpc/react'
import ReactPaginate from 'react-paginate';

const pageLimit = 6;
export const UserInterest = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [dataFetched, setDataFetched] = useState(false)

    const allCategories = api.category.allCategories.useQuery({ page: currentPage, limit: pageLimit });
    const addInterestedCategories = api.category.interestedCategories.useMutation();
    const userInterestedCategories = api.category.userInterestedCategories.useQuery();

    useEffect(() => {
        if (userInterestedCategories.isFetched && !dataFetched) {
            setSelectedCategories(userInterestedCategories.data ?? [])
            setDataFetched(true)
        }
    }, [dataFetched, userInterestedCategories.data, userInterestedCategories.isFetched])

    const handleChange = (category_id: string) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category_id)) {
                return prev.filter((id) => id !== category_id)
            } else {
                return [...prev, category_id]
            }
        })
        addInterestedCategories.mutate({ category_id })

    }

    return (
        <div className='flex justify-center w-full'>
            <Card className='w-full md:w-[500px]'>
                <CardHeader>
                    <CardTitle className='text-center'>
                        Please mark your interests!
                        <CardDescription>
                            We will keep you notified.
                        </CardDescription>
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <div className='flex flex-col gap-4'>
                        <h3>My saved interests!</h3>

                        {
                            allCategories.isFetching ? <div>
                                <InterestSkeleton />
                            </div> : allCategories.error ? <Alert>Error: {allCategories.error.message}</Alert> :

                                allCategories.data ? (
                                    <div className='flex flex-col gap-2'>
                                        {
                                            allCategories.data.categories.map((category) => {
                                                return (
                                                    <div className="flex items-center gap-2 h-7 w-full" key={category.category_id}>
                                                        <Checkbox id={category.category_id} checked={selectedCategories?.includes(category.category_id)} onCheckedChange={() => handleChange(category.category_id)} />
                                                        <label
                                                            htmlFor="terms"
                                                            className="text-sm leading-none"
                                                        >
                                                            {category.category_name}
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                ) : null
                        }
                        <Pagination totalCount={allCategories?.data?.totalCount ?? 100} itemsPerPage={pageLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}


interface PaginationProps {
    totalCount: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
}

export const Pagination: React.FC<PaginationProps> = ({ totalCount, itemsPerPage, currentPage, setCurrentPage }) => {
    const totalPages: number = Math.ceil(totalCount / itemsPerPage);

    const handlePageClick = (event) => {
        const selectedPage: number = event.selected + 1;
        setCurrentPage(selectedPage);
    };



    return (
        <ReactPaginate
            initialPage={currentPage - 1}
            className='flex gap-3 items-center flex-wrap'
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="<"
            renderOnZeroPageCount={null}
            activeClassName='font-black'
            disabledLinkClassName='cursor-not-allowed'
        />
    );
};

type InterestSkeletonProps = {
    count?: number;
}


const InterestSkeleton = ({ count = 6 }: InterestSkeletonProps) => {
    return <div className="flex flex-col space-y-2">
        {
            Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} className="h-7 w-full" />
            ))
        }
    </div>
}

