const fs = require("fs");
const path = require("path");

const Gemini_keys = [
 
    "AIzaSyATWBaufybCmja_dcpn8qMz5B6dw1DKuKk",
    "AIzaSyDouDNZZtHXlF2lgz9QqCnc-vLbz5v71Kk",
    "AIzaSyBhwCvQDSG-IF1cIWfwh05Lu-FlvJXqkRc",
    "AIzaSyCBxpd6hbxvrFfTX1lOv91nFD6-7z9nXtE",
    "AIzaSyAGq8jCCKcSyuNYX-FqrWinsvUNqv4Bey4",
    "AIzaSyA0H0rBD3zWviEo5kilQ8EE2b6u0vIXtIo",
    "AIzaSyA5_ODpSN7twkfTqLzrMPO5OOmI4A7WsQc",
    "AIzaSyDfDWTjSdTxYXKriQD7eppLscJ_oXWiXk0",
    "AIzaSyA3M8tl5BXMhRbNF7I8fTDQmIQ_oo_IeNw",
    "AIzaSyC2HLk9_WJtMTbEQxCpRSGOGPkXFVPZ35g",
    "AIzaSyBwNCakKQ6wc7pg3q4PxiBhq_rCfZOb2UU",
    "AIzaSyBsiPPnjvrDhut2DMTkQ6wxeHSPfyBEihk",
    "AIzaSyAQ1rZygvFT8NzPhAO6qxa-dtaMEHqZP64",
    "AIzaSyDOuzfEaU37K19tOtv5cjokC1pBs2lZLCQ",
    "AIzaSyA81tzxjDxVnjjZq8Op8D5AQm3-ckXA0cg",
    "AIzaSyB5Hu2ZLAqsEfiZuQi94RhIbCe1KcOj4DM",
    "AIzaSyDMiBX1S2gQVxUFT85rnMrVNruWmBKwlTk",
    "AIzaSyC1lPUfpiJnsbDL2CdAa5zZb9CL4tgvK80",
    "AIzaSyArInw0_5TGUcVuO0LKmNQLy10lCW49okM",
    "AIzaSyBJTwgOwvmu7w_rXcvY5or7ZI2vvou70cA",
    "AIzaSyDmYhOZLV4hd0apv6ZM1R3NS7LWmTpp_s4",
    "AIzaSyApO0edRaTwI2JWkhsZq_SPyPQ-q5OeE4o",
    "AIzaSyCpdaWdiYW2__6cRywmzkH6Kwr0TpgjP_E",
    "AIzaSyCuR1HxXWSXgoY_Nlw6OWMLEaOGDj7YRF8",
    "AIzaSyDgSGUAH569RjrmYjz-QUsDMqjITiHS7OA",
    "AIzaSyDNJ-IRsFQumvGEi044P_J8zPs3wIU367o",
    "AIzaSyBz6jaMp4Z5304Knx9UiJdX8DQjw1lqg9g",
    "AIzaSyBHVdQ5gjbWiYrxUNE_wbNTZ_aUGPjWqwI",
    "AIzaSyDNa1rY4QAiVwzj_1LcGPPFAetEfVa7zr0",
    "AIzaSyA9Df2q2kOR9MZkrCimGjgUVAKuz1kyZPg",
    "AIzaSyDAwMfnUqo7REPxSkLVOCo9OTeaEHAf43E",
    "AIzaSyAv4K3hVofefPm1d5mt4Y39NQVXNQ49Dbg",
    "AIzaSyB1YZPMxgYzLdhyWOoLQoi6Akv_AVZQihs",
    "AIzaSyDV9XzIcYhYw9uqNrWZNfI25GT3iFlGy3A",
    "AIzaSyAIcaMSaIPnbsulIMi7WJSrx95tiwyyjIo",
    "AIzaSyDi4JRtfBP0NEXXWLT40rYTD5-_bIBIogQ",
    "AIzaSyADgAkDx5jvf8kmyk9NqcKSQtSNqeG62qA",
    "AIzaSyDYeeex41Ssr409I1sx04Jxk3xlb-z1O5M",
    "AIzaSyAF8TSVWvVTv62X-bmeHTXv21KBDgcYDVE",
    "AIzaSyBUACYkd6ZGP2madg6weu5Twbrb8LtsjKQ",
    "AIzaSyB6yhfVxwbEAwXcgoApKTJPeutdjH_yWH4",
    "AIzaSyAwePV5GXjqn2IrHs9rWlZHGeei4LvXrSo",
    "AIzaSyBUHKun0ofNXC4c57lWM7VwVA5627BdCsI",
    "AIzaSyCCMWWDVJq83MCTtt4za1LMk3rPtEyO2DE",
];

function LoadGeminiKeys() {
  const envFilePath = path.join(__dirname, "../.env");
  let envContent = "";

  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, "utf-8");
  }

  const envLines = envContent.split("\n");
  const existingKeys = new Set(
    envLines
      .filter((line) => line.startsWith("API_KEY_"))
      .map((line) => line.split("=")[1])
  );

  Gemini_keys.forEach((key, index) => {
    if (!existingKeys.has(key)) {
      const keyIndex = existingKeys.size + 1;
      envLines.push(`API_KEY_${keyIndex}=${key}`);

      // Add a newline after every 5 keys
      if ((index + 1) % 10 === 0) {
        envLines.push(""); // Adds a new line after every 5 keys
      }

      existingKeys.add(key);
    }
  });

  fs.writeFileSync(envFilePath, envLines.join("\n"), { flag: "w" });
  console.log(`.env file updated at ${envFilePath}`);
}

LoadGeminiKeys();
