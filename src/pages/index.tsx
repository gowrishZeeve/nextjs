import Head from "next/head";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import FakeData from "@/components/FakeData";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface Data {
    record: {
        id: number;
        uid: string;
        name: string;
        language: string;
    };
}

export default function Home() {
    const [config, setConfig] = useState<Data>({
        record: {
            id: 0,
            uid: "",
            name: "",
            language: "",
        },
    });

    const loadConfig = async () => {
        await axios.get("/api/config").then((res) => {
            setConfig(res.data);
        });
    };

    useEffect(() => {
        loadConfig();
    }, []);

    return (
        <div className="flex space-x-8 p-4">
            <Head>
                <title>Next App Example</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Link href="/view-network">View Network</Link>
            <div className="flex flex-row">
                <div className="justify-start w-full">
                    <h1 className="font-bold">CONFIG</h1>
                    <ul>
                        <li>ID: {config.record.id}</li>
                        <li>UID: {config.record.uid}</li>
                        <li>Name: {config.record.name}</li>
                        <li>Language: {config.record.language}</li>
                    </ul>
                </div>
            </div>
            <FakeData />
        </div>
    );
}
