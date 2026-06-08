-- Add this to your existing database
-- Run this in SQL Server Management Studio

-- Fees Table (if not already created)
CREATE TABLE Fees
(
    FeeId INT PRIMARY KEY IDENTITY(1,1),
    StudentName VARCHAR(200),
    Class VARCHAR(50),
    Amount DECIMAL(18,2),
    PaymentMode VARCHAR(50),
    PaymentDate DATETIME
)

-- Insert default admin user (if not already added)
INSERT INTO Admin (Username, Password) VALUES ('admin', '123123')

GO
