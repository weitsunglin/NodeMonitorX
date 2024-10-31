CREATE DATABASE MyDatabase;
GO

USE MyDatabase;
GO

CREATE TABLE YourTable (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Age INT NOT NULL
);
GO

INSERT INTO YourTable (Name, Age) VALUES ('John Doe', 30);
GO

SELECT TOP (1000) [ID], [Name], [Age] FROM [MyDatabase].[dbo].[YourTable];
GO