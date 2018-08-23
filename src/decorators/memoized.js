export function memoized(target, propertyKey, descriptor) {
    const originalGet = descriptor.get;

    descriptor.get = function () {
        if (!this.hasOwnProperty('__memoized__')) {
            Object.defineProperty(this, '__memoized__', { value: new Map() });
        }

        if (this.__memoized__.has(propertyKey)) { return this.__memoized__.get(propertyKey); }

        const value = originalGet.call(this);
        this.__memoized__.set(propertyKey, value);
        return value;
    };
}
