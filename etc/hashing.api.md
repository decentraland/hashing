## API Report File for "@dcl/hashing"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export function calculateMultipleHashesADR32(contents: EntityContentItemReference[], metadata?: any): Promise<{
    data: Uint8Array;
    hash: string;
}>;

// @public @deprecated
export function calculateMultipleHashesADR32LegacyQmHash(contents: EntityContentItemReference[], metadata?: any): Promise<{
    data: Uint8Array;
    hash: string;
}>;

// @public
export type EntityContentItemReference = {
    file: string;
    hash: string;
};

// @public @deprecated
export function hashV0(stream: AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array): Promise<string>;

// @public
export function hashV1(content: AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array): Promise<string>;

// @public
export function keccak256Hash(metadata: any, keys: string[]): string;

// (No @packageDocumentation comment for this package)

```