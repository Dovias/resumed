function isObject (item: unknown): item is Record<string, unknown> {
    return !!item && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge (target: unknown, ...sources: unknown[]): unknown {
    if (!sources?.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            const sourceValue = source[key];
            if (isObject(sourceValue)) {
                let targetValue = target[key];
                if (!targetValue) targetValue = target[key] = {};
                deepMerge(targetValue, sourceValue);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }
    return deepMerge(target, ...sources);
}