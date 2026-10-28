import { getCountries, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export function normalizePhone(value: string, country: unknown): string | null {
  if (!value.trim()) return "";
  if (value.length > 40 || typeof country !== "string" || !getCountries().includes(country as CountryCode)) return null;
  const phone = parsePhoneNumberFromString(value.trim(), { defaultCountry: country as CountryCode, extract: false });
  return phone?.isValid() ? phone.number : null;
}
