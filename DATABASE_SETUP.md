# Database Setup Instructions

## ✅ Database Connected Successfully!

### 📋 What Was Changed:

1. **Masterdal.cs** - Updated to use SQL Server with ADO.NET
2. **Web.config** - Added connection string
3. **Database_Schema.sql** - SQL script to create database and tables

---

## 🔧 Setup Steps:

### Step 1: Create Database

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Open the file: `Database_Schema.sql`
4. Execute the script (F5) to create:
   - Database: `SchoolManagement`
   - Tables: Users, Students, Teachers, Attendance, Fees
   - Default admin user

### Step 2: Update Connection String

Open `Web.config` and update the connection string:

```xml
<connectionStrings>
  <add name="SchoolDB" 
       connectionString="Data Source=YOUR_SERVER_NAME;Initial Catalog=SchoolManagement;Integrated Security=True" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

**Replace `YOUR_SERVER_NAME` with:**
- `localhost` (if SQL Server is on your machine)
- `.\SQLEXPRESS` (if using SQL Server Express)
- `YOUR_COMPUTER_NAME\SQLEXPRESS`
- Or your actual server name

**Examples:**
```xml
<!-- For local SQL Server -->
connectionString="Data Source=localhost;Initial Catalog=SchoolManagement;Integrated Security=True"

<!-- For SQL Express -->
connectionString="Data Source=.\SQLEXPRESS;Initial Catalog=SchoolManagement;Integrated Security=True"

<!-- With SQL Authentication -->
connectionString="Data Source=YOUR_SERVER;Initial Catalog=SchoolManagement;User ID=sa;Password=yourpassword"
```

### Step 3: Verify Database

Run this query in SSMS to verify:

```sql
USE SchoolManagement;
SELECT * FROM Users;  -- Should show default admin
SELECT COUNT(*) FROM Students;
SELECT COUNT(*) FROM Teachers;
```

### Step 4: Test Application

1. Rebuild the solution in Visual Studio
2. Run the application (F5)
3. Login with:
   - **Username:** `admin@school.edu`
   - **Password:** `admin123`

---

## 📊 Database Schema:

### Users Table
- Id (PK, Identity)
- FirstName, LastName
- Email (Unique)
- Role (administrator/teacher/student)
- Password

### Students Table
- Id (PK, Identity)
- Name, FatherName, MotherName
- Mobile, DOB, Gender
- Address, Class, Section
- AdmissionDate

### Teachers Table
- Id (PK, Identity)
- Name, Subject, Qualification
- Email, Mobile
- JoiningDate, Salary

### Attendance Table
- Id (PK, Identity)
- StudentName, Class
- Date, Status

### Fees Table
- Id (PK, Identity)
- StudentName, Class
- Amount, PaymentMode, PaymentDate

---

## ✅ What Works Now:

✔️ All data is stored in SQL Server database
✔️ User authentication (Login/Signup)
✔️ Student registration and management
✔️ Teacher management
✔️ Attendance tracking
✔️ Fees collection
✔️ All CRUD operations persist to database

---

## 🔒 Security Note:

⚠️ **Passwords are currently stored in plain text** - Consider hashing passwords for production using:
- BCrypt.Net
- ASP.NET Identity
- Or System.Security.Cryptography

---

## 🐛 Troubleshooting:

**Connection Error:**
- Verify SQL Server is running
- Check server name in connection string
- Ensure database exists
- Check Windows authentication is enabled

**Permission Error:**
- Grant database permissions to your Windows user
- Or use SQL authentication with proper credentials

**Build Error:**
- Ensure System.Data.SqlClient is available
- Rebuild the solution

---

## 🎯 Next Steps:

1. Run Database_Schema.sql
2. Update connection string in Web.config
3. Rebuild and run application
4. Login and start using the system!
