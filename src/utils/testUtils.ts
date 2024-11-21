import { AnyZodObject } from "zod";

export const shouldPass = (schema: AnyZodObject, data: object) => {
  const parsed = schema.safeParse(data);
  expect(parsed.success).toBe(true);
  expect(parsed.error).toBeUndefined();
  expect(parsed.data).toBeDefined();
  return parsed;
}

export const shouldFail = (schema: AnyZodObject, data: object) => {
  const parsed = schema.safeParse(data);
  expect(parsed.success).toBe(false);
  expect(parsed.error).toBeDefined();
  expect(parsed.data).toBeUndefined();
  return parsed;
}