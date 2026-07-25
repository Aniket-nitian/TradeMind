export interface RawBrokerFill {
    externalTradeId: string;
    broker: string;
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    price: number;
    tradeTime: string;
    segment: string;
    product: string;
    exchange?: string;
    brokerage: number;
    taxes: number;
}

export interface BrokerConnection {
    brokerUserId: string;
    accessToken: string;
    expiresAt?: Date;
    refreshPayload?: string;
}

export interface BrokerProvider {
    broker: string;

    connect(credentials: Record<string, string>): Promise<BrokerConnection>;

    fetchTrades(
        connection: { accessToken: string; brokerUserId: string },
        range: { fromDate: Date; toDate: Date }
    ): Promise<RawBrokerFill[]>;

    renewToken?(connection: {
        accessToken: string;
        refreshToken?: string;
    }): Promise<{ accessToken: string; expiresAt: Date }>;
}
