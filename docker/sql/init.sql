CREATE DATABASE MyDatabase;
GO

USE MyDatabase;
GO

CREATE TABLE SystemTable (
    ID INT PRIMARY KEY IDENTITY(1,1),
    SystemName NVARCHAR(100) NOT NULL,
    SystemVersion NVARCHAR(50) NOT NULL,
    MaintenanceMode BIT NOT NULL DEFAULT 0  -- 0 = False, 1 = True
);
GO

-- 插入測試資料
INSERT INTO SystemTable (SystemName, SystemVersion, MaintenanceMode) 
VALUES ('MySystem', '1.0.0', 0);  -- 0 代表 False
GO

-- 查詢資料
SELECT TOP (1000) [ID], [SystemName], [SystemVersion], [MaintenanceMode] 
FROM [MyDatabase].[dbo].[SystemTable];
GO
