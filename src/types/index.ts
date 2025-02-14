// Define a type for the generated post structure
export interface GeneratedPost {
    title: string;
    subtitle: string;
    topic: string;
    topicSlug: string;
    tags: string[];
    keywords: string[];
    coverImageQuery: string;
    contentMarkdown: string;
    image: string;
}

// Type definition for the GraphQL response data
export interface PublishPostInput {
    publicationId: string | undefined;
    title: string;
    subtitle: string;
    contentMarkdown: string;
    coverImageOptions: {
        coverImageURL: string | undefined;
    };
    tags: Array<{
        name: string;
        slug: string;
    }>;
}

export interface PublishPostResponse {
    data?: {
        publishPost: {
            post: {
                url: string;
            };
        };
    };
    errors?: Array<{ message: string; extensions?: { code: string } }>;
}



// Type for the response data from Google Custom Search API
interface GoogleSearchItem {
  link: string;
}

export interface GoogleSearchResponse {
  items: GoogleSearchItem[];
}


export interface BlogPost {
    title: string;
    subtitle: string;
    topic: string;
    topicSlug: string;
    tags: string[];
    keywords: string[];
    coverImageQuery: string;
    contentMarkdown: string;
  }