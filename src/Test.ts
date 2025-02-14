import axios from "axios";

export async function searchImage(query: string): Promise<string | null> {
    try {
        console.log(`🔍 Searching: ${query}`);
        const { data } = await axios.get("https://customsearch.googleapis.com/customsearch/v1", {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.SEARCH_ENGINE_ID,
                c2coff: "1",
                fileType: "JPEG,PNG",
                q: query,
                safe: "off",
                searchType: "image",
                prettyPrint: "true",
                num: 1,
            },
        });

        return data.items?.[0]?.link || null;

    } catch (error) {
        console.error("✖ Error fetching image", error);
        return null;
    }
}
