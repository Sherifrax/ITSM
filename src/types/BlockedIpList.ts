export interface IpRateLimit {
    iPaddress: string;
    requestCount: number;
    lastRequestTime: string;
    isBlocked: boolean;
}

export interface IpRateLimitHistory {
    iPaddress: string;
    requestCount: number;
    lastRequestTime: string;
    isBlocked: boolean;
    comment: string;
    updatedate: string;
}