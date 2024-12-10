import { z } from 'zod';

type HexString = `0x${string}`;

const HexStringSchema = z.string().refine(
  (value) => /^0x[0-9a-fA-F]+$/.test(value), // Regex to validate hex string
  {
    message: "Domain must be a hexadecimal string starting with '0x'.",
  }
);

const EIP712DomainSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  chainId: z.union([z.number(), HexStringSchema]).optional(),
  verifyingContract: HexStringSchema.optional(),
  salt: HexStringSchema.optional(),
});

const TypedDataFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const TypedDataSchema = z.object({
  types: z.record(z.array(TypedDataFieldSchema)),
  domain: EIP712DomainSchema,
  primaryType: z.string(),
  message: z.record(z.any()),
});

export type EIP712Domain = z.infer<typeof EIP712DomainSchema>;
export type TypedDataField = z.infer<typeof TypedDataFieldSchema>;
export type TypedData = z.infer<typeof TypedDataSchema> & {
  domain: EIP712Domain & {
    verifyingContract?: HexString;
    salt?: HexString;
  };
};
