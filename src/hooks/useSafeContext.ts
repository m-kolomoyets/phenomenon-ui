import { useContext } from 'react';

export const useSafeContext = (contextObject: React.Context<unknown>) => {
    const context = useContext(contextObject);

    if (!contextObject.displayName) {
        throw new Error('Context.displayName is not set, it must be set for useSafeContext');
    }

    if (context === undefined) {
        const contextName = contextObject.displayName.split('Context')[0];

        throw new TypeError(`use${contextName}Context must be used within a ${contextName}Provider`);
    }

    return context;
};
