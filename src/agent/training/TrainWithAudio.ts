import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY_41 as string;
if (!apiKey) {
    throw new Error("API key is missing");
}

export class AIAudioFileService {

    private fileManager: GoogleAIFileManager;
    private genAI: GoogleGenerativeAI;

    constructor() {
        this.fileManager = new GoogleAIFileManager(apiKey);
        this.genAI = new GoogleGenerativeAI(apiKey);
    }
    /**
     * Uploads the files to Google AIFileManager, i.e a 48 hours temp storage.
     * @param filePath - The local path of the file to upload.
     * @param displayName - The display name for the uploaded file.
     * @param mimeType - The MIME type of the file.
     */
    async processFile(filePath: string, displayName: string, mimeType: string): Promise<string> {
        try {
            const uploadResult = await this.fileManager.uploadFile(filePath, {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                mimeType,
                displayName,
            });

            let file = await this.fileManager.getFile(uploadResult.file.name);

            // Wait for the file to be processed
            while (file.state === FileState.PROCESSING) {
                process.stdout.write(".");
                await new Promise((resolve) => setTimeout(resolve, 10_000));
                file = await this.fileManager.getFile(uploadResult.file.name);
            }

            if (file.state === FileState.FAILED) {
                throw new Error("File processing failed.");
            }

            // Generate content using Gemini
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent([
                "Tell me about this audio clip.",
                {
                    fileData: {
                        fileUri: uploadResult.file.uri,
                        mimeType: uploadResult.file.mimeType,
                    },
                },
            ]);

            // Delete the uploaded file from Google AI
            await this.fileManager.deleteFile(uploadResult.file.name);
            console.log(`Deleted ${uploadResult.file.displayName}`);

            return result.response.text();

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error processing file: ${error.message}`);
            } else {
                throw new Error(`Unknown error occurred during file processing.`);
            }
        } finally {
            // Delete the temporary file from the local server
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
}
