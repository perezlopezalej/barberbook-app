// In MVP there is one shop. This ID comes from the seed data.
// After running 001_initial.sql, query: SELECT id FROM shops LIMIT 1;
// and replace this value.
export const SHOP_ID = process.env.NEXT_PUBLIC_SHOP_ID ?? "replace-with-your-shop-uuid";
