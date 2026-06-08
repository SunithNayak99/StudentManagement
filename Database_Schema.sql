CREATE DATABASE SchoolManagement;
GO

USE SchoolManagement;
GO

-- Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Role NVARCHAR(50) NOT NULL,
    Password NVARCHAR(255) NOT NULL
);

-- Students Table
CREATE TABLE Students (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    FatherName NVARCHAR(200) NOT NULL,
    MotherName NVARCHAR(200) NOT NULL,
    Mobile NVARCHAR(20) NOT NULL,
    DOB DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    Class NVARCHAR(50) NOT NULL,
    Section NVARCHAR(10) NOT NULL,
    AdmissionDate DATE NOT NULL
);

-- Teachers Table
CREATE TABLE Teachers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    Qualification NVARCHAR(200) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Mobile NVARCHAR(20) NOT NULL,
    JoiningDate DATE NOT NULL,
    Salary DECIMAL(18,2) NOT NULL
);

-- Attendance Table
CREATE TABLE Attendance (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentName NVARCHAR(200) NOT NULL,
    Class NVARCHAR(50) NOT NULL,
    Date DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL
);

-- Fees Table
CREATE TABLE Fees (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentName NVARCHAR(200) NOT NULL,
    Class NVARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    PaymentMode NVARCHAR(50) NOT NULL,
    PaymentDate DATE NOT NULL
);

-- Insert default admin user
INSERT INTO Users (FirstName, LastName, Email, Role, Password)
VALUES ('Admin', 'User', 'admin@school.edu', 'administrator', 'admin123');

GO
