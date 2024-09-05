import { asyncCallWithSpan } from '@map-colonies/telemetry';
import { Tracer } from '@opentelemetry/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function withSpanAsyncV4<This extends { tracer: Tracer }, Args extends unknown[]>(
  _target: This,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(this: This, ...args: Args) => Promise<any>>
): TypedPropertyDescriptor<(this: This, ...args: Args) => Promise<any>> {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error('Decorated method is undefined');
  }

  descriptor.value = async function (this: This, ...args: Args): Promise<any> {
    return asyncCallWithSpan(async () => originalMethod.call(this, ...args), this.tracer, String(propertyKey));
  };

  return descriptor;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
