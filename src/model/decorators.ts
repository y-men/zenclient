
// Decorator to log the function name and arguments
export const Log = (target: any, key: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`func: ${key}, args: ${args}`);
        return  original.apply(this, args);
    };
    return descriptor;
}


//export default logd;
