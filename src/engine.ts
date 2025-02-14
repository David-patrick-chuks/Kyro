import { google } from "googleapis";

const customsearch = google.customsearch("v1");

async function searchEngine(query: string): Promise<void> {
    try {
        const resp = await customsearch.cse.list({
            cx: "e0065377de4434595",
            q: query,
            auth: "AIzaSyANBZVYuvlAtkg4WymLlt3bW4rHcvhLUOQ", 
            start: 1, 
            c2coff: "1",
            fileType: "JPEG,PNG",
            safe: "off",
            searchType: "image",
            prettyPrint: true, 
        });

        if (resp.data.items && resp.data.items.length > 0) {
            const result = resp.data.items[0];
            console.log(result);
        } else {
            console.log("No results found.");
        }

    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

searchEngine("Who is Elon Musk");
