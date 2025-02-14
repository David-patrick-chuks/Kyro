import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mime from "mime-types";  

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY_41;
if (!apiKey) {
  throw new Error("API key is missing");
}

const fileManager = new GoogleAIFileManager(apiKey);

// Function to upload, process, and delete the audio file with support for various formats
const processAudioFile = async (fileName: string): Promise<void> => {
  try {
    // Resolve the file path relative to the project root
    const filePath = path.resolve(__dirname, fileName);

    // Check if the file exists at the resolved path
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Get MIME type of the file based on the extension
    const mimeType = mime.lookup(filePath);
    if (!mimeType || !mimeType.startsWith("audio/")) {
      throw new Error("Invalid audio file format.");
    }

    // Upload the audio file with the correct MIME type
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: mimeType,
      displayName: "Audio sample",
    });

    let file = await fileManager.getFile(uploadResult.file.name);

    // Wait for the audio file to be processed
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      // Sleep for 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      // Fetch the file from the API again
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed.");
    }

    // Log the uploaded file URI
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );

    // Generate content using Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "Generate a transcript of the audio.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // Log the response
    console.log(result.response.text());

    // Delete the uploaded file after processing
    await fileManager.deleteFile(uploadResult.file.name);
    console.log(`Deleted ${uploadResult.file.displayName}`);

  } catch (error) {
    console.error("Error processing audio file:", error);
  }
};

// Example usage: Call the function with the correct file name relative to the project root
processAudioFile("LilTjay.mp3").catch((error) => {
  console.error("An error occurred:", error);
});
