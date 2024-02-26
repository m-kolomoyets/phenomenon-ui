export const intlPluralRulesSimplify = (value: number, singular: string, plural: string): string => {
    const pluralRules = new Intl.PluralRules('en-US');
    const rule = pluralRules.select(value);

    if (rule === 'one') {
        return singular;
    }

    return plural;
};
