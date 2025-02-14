const getUptime = (): string => {
    const uptimeInSeconds: number = process.uptime();
    const hours: number = Math.floor(uptimeInSeconds / 3600);
    const minutes: number = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds: number = Math.floor(uptimeInSeconds % 60);
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

const systemUptime: string = getUptime();