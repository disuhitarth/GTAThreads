import { toast } from "sonner";
import {
  SHOPIFY_API_VERSION as ENV_SHOPIFY_API_VERSION,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN as ENV_SHOPIFY_STOREFRONT_TOKEN,
} from "@/lib/env";

export const SHOPIFY_API_VERSION = ENV_SHOPIFY_API_VERSION;
export const SHOPIFY_STORE_PERMANENT_DOMAIN = SHOPIFY_STORE_DOMAIN;
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = ENV_SHOPIFY_STOREFRONT_TOKEN;

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
  collections: { edges: Array<{ node: { id: string; handle: string; title: string } }> };
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

export interface ShopifyCollectionNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  image: ShopifyImage | null;
  products?: { edges: ShopifyProduct[] };
}

interface ShopifyGraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
}

interface ShopifyResponse<T> {
  data: T;
  errors?: ShopifyGraphQLError[];
}

export async function storefrontApiRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data: T } | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const json: ShopifyResponse<T> = await response.json();
  if (json.errors?.length) {
    throw new Error(`Shopify error: ${json.errors.map((e) => e.message).join(", ")}`);
  }
  return { data: json.data };
}

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText width height } } }
  variants(first: 25) {
    edges { node {
      id title availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
    } }
  }
  options { name values }
  collections(first: 10) { edges { node { id handle title } } }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      image { url altText width height }
      products(first: 48) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image { url altText width height }
        }
      }
    }
  }
`;

export async function fetchProducts(first = 24, query?: string): Promise<ShopifyProduct[]> {
  const res = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
    PRODUCTS_QUERY,
    { first, query },
  );
  return res?.data?.products?.edges ?? [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProductNode | null> {
  const res = await storefrontApiRequest<{ productByHandle: ShopifyProductNode | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle },
  );
  return res?.data?.productByHandle ?? null;
}

export async function fetchCollections(first = 50): Promise<ShopifyCollectionNode[]> {
  const res = await storefrontApiRequest<{
    collections: { edges: Array<{ node: ShopifyCollectionNode }> };
  }>(COLLECTIONS_QUERY, { first });
  return res?.data?.collections?.edges?.map((edge) => edge.node) ?? [];
}

export async function fetchCollectionByHandle(
  handle: string,
): Promise<ShopifyCollectionNode | null> {
  const res = await storefrontApiRequest<{ collection: ShopifyCollectionNode | null }>(
    COLLECTION_BY_HANDLE_QUERY,
    { handle },
  );
  return res?.data?.collection ?? null;
}

// ------- Cart -------

const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>,
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
      lines: { edges: Array<{ node: { id: string; merchandise: { id: string } } }> };
    } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

export async function createShopifyCart(item: {
  variantId: string;
  quantity: number;
}): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });
  const errors = data?.data?.cartCreate?.userErrors ?? [];
  if (errors.length) {
    console.error("Cart creation failed:", errors);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

interface CartLinesResponse {
  cartLinesAdd: {
    cart: {
      id: string;
      lines: { edges: Array<{ node: { id: string; merchandise: { id: string } } }> };
    } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: { variantId: string; quantity: number },
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<CartLinesResponse>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}

interface CartUpdateResponse {
  cartLinesUpdate: {
    cart: { id: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<CartUpdateResponse>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) return { success: false };
  return { success: true };
}

interface CartRemoveResponse {
  cartLinesRemove: {
    cart: { id: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<CartRemoveResponse>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) return { success: false };
  return { success: true };
}

interface CartQueryResponse {
  cart: { id: string; totalQuantity: number } | null;
}

export async function fetchCartTotalQuantity(cartId: string): Promise<number | null> {
  const data = await storefrontApiRequest<CartQueryResponse>(CART_QUERY, { id: cartId });
  if (!data) return null;
  return data?.data?.cart?.totalQuantity ?? 0;
}

// ------- Customer Auth -------

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  defaultAddress: {
    address1: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  orders: Array<{
    id: string;
    name: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string | null;
    fulfillmentStatus: string | null;
    totalPrice: { amount: string; currencyCode: string };
    lineItems: Array<{ title: string; quantity: number; variantTitle: string | null }>;
  }>;
}

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id firstName lastName email }
      customerUserErrors { field message code }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { field message code }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors { field message }
    }
  }
`;

const CUSTOMER_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id firstName lastName email phone
      defaultAddress { address1 city province country zip }
      orders(first: 20) {
        edges { node {
          id name orderNumber processedAt financialStatus fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 10) {
            edges { node { title quantity variantTitle } }
          }
        } }
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { field message code }
    }
  }
`;

export async function customerRegister(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ success: true; customer: { id: string } } | { success: false; error: string }> {
  const res = await storefrontApiRequest<{
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: Array<{ field: string[] | null; message: string; code: string }>;
    };
  }>(CUSTOMER_CREATE_MUTATION, { input });
  const errors = res?.data?.customerCreate?.customerUserErrors;
  if (errors?.length) {
    return { success: false, error: errors.map((e) => e.message).join(", ") };
  }
  if (!res?.data?.customerCreate?.customer) {
    return { success: false, error: "Failed to create account" };
  }
  return { success: true, customer: res.data.customerCreate.customer };
}

export async function customerLogin(input: {
  email: string;
  password: string;
}): Promise<
  | { success: true; accessToken: string; expiresAt: string }
  | { success: false; error: string }
> {
  const res = await storefrontApiRequest<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: Array<{ field: string[] | null; message: string; code: string }>;
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { input });
  const errors = res?.data?.customerAccessTokenCreate?.customerUserErrors;
  if (errors?.length) {
    return { success: false, error: errors.map((e) => e.message).join(", ") };
  }
  const token = res?.data?.customerAccessTokenCreate?.customerAccessToken;
  if (!token) {
    return { success: false, error: "Invalid email or password" };
  }
  return { success: true, accessToken: token.accessToken, expiresAt: token.expiresAt };
}

export async function customerRecover(
  email: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const res = await storefrontApiRequest<{
    customerRecover: {
      customerUserErrors: Array<{ field: string[] | null; message: string; code: string }>;
    };
  }>(CUSTOMER_RECOVER_MUTATION, { email });
  const errors = res?.data?.customerRecover?.customerUserErrors;
  if (errors?.length) {
    return { success: false, error: errors.map((e) => e.message).join(", ") };
  }
  return { success: true };
}

export async function customerLogout(
  accessToken: string,
): Promise<{ success: boolean }> {
  await storefrontApiRequest<{
    customerAccessTokenDelete: { deletedAccessToken: string; userErrors: Array<{ field: string[] | null; message: string }> };
  }>(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, { customerAccessToken: accessToken });
  return { success: true };
}

interface CustomerGraphQLNode {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  defaultAddress: Customer['defaultAddress'];
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        orderNumber: number;
        processedAt: string;
        financialStatus: string | null;
        fulfillmentStatus: string | null;
        totalPrice: { amount: string; currencyCode: string };
        lineItems: {
          edges: Array<{ node: { title: string; quantity: number; variantTitle: string | null } }>;
        };
      };
    }>;
  };
}

export async function getCustomer(
  accessToken: string,
): Promise<Customer | null> {
  const res = await storefrontApiRequest<{ customer: CustomerGraphQLNode | null }>(
    CUSTOMER_QUERY,
    { customerAccessToken: accessToken },
  );
  const raw = res?.data?.customer;
  if (!raw) return null;
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone,
    defaultAddress: raw.defaultAddress,
    orders: raw.orders.edges.map((e) => ({
      ...e.node,
      lineItems: e.node.lineItems.edges.map((li) => li.node),
    })),
  };
}

export function formatPrice(amount: string | number, currency = "CAD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}
