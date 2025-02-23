"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

type Data = {
    fact: string;
    length: number;
}

export default function Test() {

    const [data, setData] = useState<Data | null>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://catfact.ninja/fact")
        .then((res) => res.json())
        .then((data) => {
            setData(data);
            setLoading(false);
        })
    }, [] )

    return (
    
        <div className='flex flex-col'>
            { loading ? ( "Loading... " ) : ( data?.fact ) }
        </div>

    )
}