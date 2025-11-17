USE QLBH_CNAG;
GO

-- Insert sample invoice details for existing invoice HD_AG_101
-- Make sure you have products in PRODUCT table first

-- Example: Add 2 products to invoice HD_AG_101
INSERT INTO INVOICE_DETAIL (detail_id, invoice_id, product_id, quantity, unit_price)
VALUES 
    ('HD_AG_101-01', 'HD_AG_101           ', 'SP_001              ', 2, 10000000),  -- 2 sản phẩm @ 10 triệu
    ('HD_AG_101-02', 'HD_AG_101           ', 'SP_002              ', 4, 2000000);   -- 4 sản phẩm @ 2 triệu

GO

-- Verify
SELECT * FROM INVOICE_DETAIL WHERE invoice_id = 'HD_AG_101           ';
GO
