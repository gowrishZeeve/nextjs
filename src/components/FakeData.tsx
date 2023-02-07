import axios from "axios";
import React, { useEffect, useState } from "react";

const FakeData = () => {
    const [data, setData] = useState<
        [
            {
                id: number;
                userId: number;
                title: string;
                body: string;
            },
        ]
    >();

    const getData = async () => {
        const url = "https://jsonplaceholder.typicode.com/posts";
        await axios.get(url).then((res) => {
            setData(res.data);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="flex text-black flex-col">
            {data &&
                data.length &&
                data.map((item) => (
                    <div key={item.id} className="mb-4 border-b">
                        <p className="font-medium">{item.title}</p>
                        <p>{item.body}</p>
                    </div>
                ))}
        </div>
    );
};

export default FakeData;
