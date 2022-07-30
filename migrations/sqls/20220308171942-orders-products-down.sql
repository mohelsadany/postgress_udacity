-- IF EXISTS will not throw error if for some reasin the table already deleted
-- CASCADE will delete the table withall of its constrains like (forign keys)
-- Use CASCADE with great care.
DROP TABLE IF EXISTS  orders_products CASCADE;