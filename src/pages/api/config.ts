import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { DynamicConfig } from "@/config/appConfig";


export default async function handler(req: NextApiRequest, res: NextApiResponse<DynamicConfig>) {
    const jsonDirectory = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(jsonDirectory + "/config.json", "utf8");
    res.status(200).json(JSON.parse(fileContents));
}
