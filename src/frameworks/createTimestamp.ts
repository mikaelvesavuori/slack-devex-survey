/**
 * @description Transform numeric timestamp to string ISO date.
 */
export const createTimestamp = (timestamp: number) => `${new Date(timestamp).toISOString()}`;
