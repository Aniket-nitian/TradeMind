import { AppError } from "../../../shared/exceptions/AppError.js";
import { dhanProvider } from "./dhan.provider.js";
import { growwProvider } from "./groww.provider.js";
import type { BrokerProvider } from "./types.js";

const registry: Record<string, BrokerProvider> = {
    DHAN: dhanProvider,
    GROWW: growwProvider,
};

export function resolveProvider(broker: string): BrokerProvider {
    const provider = registry[broker.toUpperCase()];

    if (!provider) {
        throw new AppError(
            `${broker} is not supported yet — coming soon.`,
            400
        );
    }

    return provider;
}

export type { BrokerConnection, BrokerProvider, RawBrokerFill } from "./types.js";
