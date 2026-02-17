import { clsx, type ClassValue } from "clsx"
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string'
import { CartItem, DeliveryFee, Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

// convert a prisma object into a regular js object
export function convertToPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function normalizeProduct(product: Product) {
  return {
    ...product,
    care: product.care ?? "",
    fit: product.fit ?? "",
    deliveryFee:
      product.deliveryFee &&
        typeof product.deliveryFee === "object" &&
        "lag" in product.deliveryFee &&
        "nationwide" in product.deliveryFee
        ? (product.deliveryFee as DeliveryFee)
        : null,
  };
}

// format number with decimal places
export function formatNumberToDecimal(value: number): string {
  const [int, decimal] = value.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}
// format date to dd/mm/yyyy
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}

// Format error messages
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle zode errors
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);

    return fieldErrors.join(". ");

  } else if (error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
    // Handle Prisma errors
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `This ${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Try again with a different ${field.charAt(0).toUpperCase() + field.slice(1)}.`;
  } else {
    // Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
};

// Round number to 2 decimal places
export function roundToTwoDecimalPlaces(num: number | string) {
  if (typeof num === 'number') {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  } else if (typeof num === 'string') {
    return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Invalid input type. Expected number or string.');
  }
};

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'NGN',
  style: 'currency',
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2
})

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
  } else {
    return 'NaN'
  }
}

// format number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

// shorten uuid
export function formatUUID(id: string) {
  return `..${id.substring(id.length - 6)}`
}

// format the date and time string
export function formatDateTime(dateString: Date) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions);
  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions);
  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions);
  const date = new Date(dateString);

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
    date: date
  }
}

// form the pagination links
export function formUrlQuery({ params, key, value }: { params: string, key: string, value: string | null }) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query
  }, {
    skipNull: true
  })
}
// convert an amount in naira to kobo
/**
 * Converts Naira to Kobo
 * @param naira - The amount in Naira
 * @returns The equivalent amount in Kobo
 */
export function nairaToKobo(naira: number): number {
  if (isNaN(naira)) {
    throw new Error('Invalid input: Amount must be a number')
  }

  return Math.round(naira * 100)
}
/**
 * Converts Kobo to Naira
 * @param kobo - The amount in Kobo
 * @returns The equivalent amount in Naira
 */
export function koboToNaira(kobo: number): number {
  if (isNaN(kobo)) {
    throw new Error('Invalid input: Amount must be a number');
  }

  return kobo / 100;
}

export function calculateCartPricesClient(items: CartItem[]) {
  const itemsPrice = Math.round(items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0) * 100) / 100,
    shippingPrice = Math.round((itemsPrice > 100 ? 0 : 10) * 100) / 100,
    taxPrice = Math.round((0.075 * itemsPrice) * 100) / 100,
    totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}