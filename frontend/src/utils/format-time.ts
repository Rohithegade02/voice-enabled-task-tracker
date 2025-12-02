export const formatTime = (seconds: number) =>
    new Date(seconds * 1000).toISOString().slice(14, 19);
