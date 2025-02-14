import fs from 'fs';
import path from 'path';

export class TopicRandomizer {
    private topics: string[];
    private usedTopics: string[];

    constructor(topics: string[]) {
        this.topics = topics;
        this.usedTopics = [];
    }

    getRandomTopic(): string {
        // Check if all topics have been used
        if (this.usedTopics.length === this.topics.length) {
            // Reset used topics and shuffle
            this.usedTopics = [];
            this.shuffleTopics();
        }

        // Select a random topic that hasn't been used
        const remainingTopics = this.topics.filter(topic => !this.usedTopics.includes(topic));
        const randomIndex = Math.floor(Math.random() * remainingTopics.length);
        const randomTopic = remainingTopics[randomIndex];

        // Mark the selected topic as used
        this.usedTopics.push(randomTopic);

        return randomTopic;
    }

    private shuffleTopics(): void {
        // Shuffle the topics array to randomize order
        for (let i = this.topics.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.topics[i], this.topics[j]] = [this.topics[j], this.topics[i]];
        }
    }
}



export function getApiKeys(): string[] {

    const apiKeys: string[] = [];
    const envFilePath = path.join(__dirname, '../../.env');
    const envContent = fs.readFileSync(envFilePath, 'utf-8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
        const match = line.match(/^API_KEY_(\d+)=(.*)$/);
        if (match) {
            const key = process.env[`API_KEY_${match[1]}`] || `API_KEY_${match[1]}`;
            apiKeys.push(key);
        }
    });

    return apiKeys;
}



