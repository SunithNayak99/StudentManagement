using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using management.Models;

namespace management.DataAccessLayer
{
    public class Masterdal
    {
        


        private readonly string _connectionString;

        public Masterdal()

        {
            _connectionString = ConfigurationManager.ConnectionStrings["studentmanagement"].ConnectionString;
        }

        // ─── Auth ────────────────────────────────────────────────
        public bool Login(string username, string password)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(*) FROM Admin WHERE Username=@username AND Password=@password";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@username", username);
                cmd.Parameters.AddWithValue("@password", password);
                conn.Open();
                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        public bool Register(SignupModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string checkQuery = "SELECT COUNT(*) FROM Admin WHERE Username=@username";
                SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                checkCmd.Parameters.AddWithValue("@username", model.Email);
                if ((int)checkCmd.ExecuteScalar() > 0) return false;

                string query = "INSERT INTO Admin (Username, Password) VALUES (@username, @password)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@username", model.Email);
                cmd.Parameters.AddWithValue("@password", model.Password);
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // ─── Students ────────────────────────────────────────────
        public List<StudentModel> GetAllStudents()
        {
            List<StudentModel> students = new List<StudentModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Students";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    students.Add(new StudentModel
                    {
                        Id = (int)reader["StudentId"],
                        Name = reader["StudentName"].ToString(),
                        FatherName = reader["FatherName"].ToString(),
                        MotherName = reader["MotherName"].ToString(),
                        Mobile = reader["Mobile"].ToString(),
                        DOB = (DateTime)reader["DOB"],
                        Gender = reader["Gender"].ToString(),
                        Address = reader["Address"].ToString(),
                        Class = reader["Class"].ToString(),
                        Section = reader["Section"].ToString(),
                        AdmissionDate = (DateTime)reader["AdmissionDate"]
                    });
                }
            }
            return students;
        }

        public StudentModel GetStudentById(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Students WHERE StudentId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new StudentModel
                    {
                        Id = (int)reader["StudentId"],
                        Name = reader["StudentName"].ToString(),
                        FatherName = reader["FatherName"].ToString(),
                        MotherName = reader["MotherName"].ToString(),
                        Mobile = reader["Mobile"].ToString(),
                        DOB = (DateTime)reader["DOB"],
                        Gender = reader["Gender"].ToString(),
                        Address = reader["Address"].ToString(),
                        Class = reader["Class"].ToString(),
                        Section = reader["Section"].ToString(),
                        AdmissionDate = (DateTime)reader["AdmissionDate"]
                    };
                }
            }
            return null;
        }

        public bool AddStudent(StudentModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Students (StudentName, FatherName, MotherName, Mobile, Address, DOB, Gender, Class, Section, AdmissionDate) VALUES (@name, @fatherName, @motherName, @mobile, @address, @dob, @gender, @class, @section, @admissionDate); SELECT CAST(SCOPE_IDENTITY() AS INT)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", model.Name);
                cmd.Parameters.AddWithValue("@fatherName", model.FatherName);
                cmd.Parameters.AddWithValue("@motherName", model.MotherName);
                cmd.Parameters.AddWithValue("@mobile", model.Mobile);
                cmd.Parameters.AddWithValue("@address", model.Address);
                cmd.Parameters.AddWithValue("@dob", model.DOB);
                cmd.Parameters.AddWithValue("@gender", model.Gender);
                cmd.Parameters.AddWithValue("@class", model.Class);
                cmd.Parameters.AddWithValue("@section", model.Section);
                cmd.Parameters.AddWithValue("@admissionDate", model.AdmissionDate);
                conn.Open();
                model.Id = (int)cmd.ExecuteScalar();
                return model.Id > 0;
            }
        }

        public bool UpdateStudent(StudentModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Students SET StudentName=@name, FatherName=@fatherName, MotherName=@motherName, Mobile=@mobile, Address=@address, DOB=@dob, Gender=@gender, Class=@class, Section=@section, AdmissionDate=@admissionDate WHERE StudentId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", model.Id);
                cmd.Parameters.AddWithValue("@name", model.Name);
                cmd.Parameters.AddWithValue("@fatherName", model.FatherName);
                cmd.Parameters.AddWithValue("@motherName", model.MotherName);
                cmd.Parameters.AddWithValue("@mobile", model.Mobile);
                cmd.Parameters.AddWithValue("@address", model.Address);
                cmd.Parameters.AddWithValue("@dob", model.DOB);
                cmd.Parameters.AddWithValue("@gender", model.Gender);
                cmd.Parameters.AddWithValue("@class", model.Class);
                cmd.Parameters.AddWithValue("@section", model.Section);
                cmd.Parameters.AddWithValue("@admissionDate", model.AdmissionDate);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool DeleteStudent(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Students WHERE StudentId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // ─── Teachers ────────────────────────────────────────────
        public List<TeacherModel> GetAllTeachers()
        {
            List<TeacherModel> teachers = new List<TeacherModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Teachers";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    teachers.Add(new TeacherModel
                    {
                        Id = (int)reader["TeacherId"],
                        Name = reader["TeacherName"].ToString(),
                        Subject = reader["Subject"].ToString(),
                        Qualification = reader["Qualification"].ToString(),
                        Email = reader["Email"].ToString(),
                        Mobile = reader["Mobile"].ToString(),
                        JoiningDate = (DateTime)reader["JoiningDate"],
                        Salary = (decimal)reader["Salary"]
                    });
                }
            }
            return teachers;
        }

        public TeacherModel GetTeacherById(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Teachers WHERE TeacherId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new TeacherModel
                    {
                        Id = (int)reader["TeacherId"],
                        Name = reader["TeacherName"].ToString(),
                        Subject = reader["Subject"].ToString(),
                        Qualification = reader["Qualification"].ToString(),
                        Email = reader["Email"].ToString(),
                        Mobile = reader["Mobile"].ToString(),
                        JoiningDate = (DateTime)reader["JoiningDate"],
                        Salary = (decimal)reader["Salary"]
                    };
                }
            }
            return null;
        }

        public bool AddTeacher(TeacherModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Teachers (TeacherName, Subject, Qualification, Email, Mobile, JoiningDate, Salary) VALUES (@name, @subject, @qualification, @email, @mobile, @joiningDate, @salary); SELECT CAST(SCOPE_IDENTITY() AS INT)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", model.Name);
                cmd.Parameters.AddWithValue("@subject", model.Subject);
                cmd.Parameters.AddWithValue("@qualification", model.Qualification);
                cmd.Parameters.AddWithValue("@email", model.Email);
                cmd.Parameters.AddWithValue("@mobile", model.Mobile);
                cmd.Parameters.AddWithValue("@joiningDate", model.JoiningDate);
                cmd.Parameters.AddWithValue("@salary", model.Salary);
                conn.Open();
                model.Id = (int)cmd.ExecuteScalar();
                return model.Id > 0;
            }
        }

        public bool UpdateTeacher(TeacherModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Teachers SET TeacherName=@name, Subject=@subject, Qualification=@qualification, Email=@email, Mobile=@mobile, JoiningDate=@joiningDate, Salary=@salary WHERE TeacherId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", model.Id);
                cmd.Parameters.AddWithValue("@name", model.Name);
                cmd.Parameters.AddWithValue("@subject", model.Subject);
                cmd.Parameters.AddWithValue("@qualification", model.Qualification);
                cmd.Parameters.AddWithValue("@email", model.Email);
                cmd.Parameters.AddWithValue("@mobile", model.Mobile);
                cmd.Parameters.AddWithValue("@joiningDate", model.JoiningDate);
                cmd.Parameters.AddWithValue("@salary", model.Salary);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool DeleteTeacher(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Teachers WHERE TeacherId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // ─── Attendance ──────────────────────────────────────────
        public List<AttendanceModel> GetAllAttendance()
        {
            List<AttendanceModel> attendance = new List<AttendanceModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT a.AttendanceId, s.StudentName, s.Class, a.AttendanceDate, a.Status FROM Attendance a INNER JOIN Students s ON a.StudentId=s.StudentId";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    attendance.Add(new AttendanceModel
                    {
                        Id = (int)reader["AttendanceId"],
                        StudentName = reader["StudentName"].ToString(),
                        Class = reader["Class"].ToString(),
                        Date = (DateTime)reader["AttendanceDate"],
                        Status = reader["Status"].ToString()
                    });
                }
            }
            return attendance;
        }

        public bool AddAttendance(AttendanceModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string getStudentIdQuery = "SELECT StudentId FROM Students WHERE StudentName=@studentName";
                SqlCommand getIdCmd = new SqlCommand(getStudentIdQuery, conn);
                getIdCmd.Parameters.AddWithValue("@studentName", model.StudentName);
                object result = getIdCmd.ExecuteScalar();
                if (result == null) return false;
                int studentId = (int)result;

                string query = "INSERT INTO Attendance (StudentId, AttendanceDate, Status) VALUES (@studentId, @date, @status); SELECT CAST(SCOPE_IDENTITY() AS INT)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@studentId", studentId);
                cmd.Parameters.AddWithValue("@date", model.Date);
                cmd.Parameters.AddWithValue("@status", model.Status);
                model.Id = (int)cmd.ExecuteScalar();
                return model.Id > 0;
            }
        }

        public bool DeleteAttendance(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Attendance WHERE AttendanceId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // ─── Fees ────────────────────────────────────────────────
        public List<FeesModel> GetAllFees()
        {
            List<FeesModel> fees = new List<FeesModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Fees";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    fees.Add(new FeesModel
                    {
                        Id = (int)reader["FeeId"],
                        StudentName = reader["StudentName"].ToString(),
                        Class = reader["Class"].ToString(),
                        Amount = (decimal)reader["Amount"],
                        PaymentMode = reader["PaymentMode"].ToString(),
                        PaymentDate = (DateTime)reader["PaymentDate"]
                    });
                }
            }
            return fees;
        }

        public bool AddFee(FeesModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Fees (StudentName, Class, Amount, PaymentMode, PaymentDate) VALUES (@studentName, @class, @amount, @paymentMode, @paymentDate); SELECT CAST(SCOPE_IDENTITY() AS INT)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@studentName", model.StudentName);
                cmd.Parameters.AddWithValue("@class", model.Class);
                cmd.Parameters.AddWithValue("@amount", model.Amount);
                cmd.Parameters.AddWithValue("@paymentMode", model.PaymentMode);
                cmd.Parameters.AddWithValue("@paymentDate", model.PaymentDate);
                conn.Open();
                model.Id = (int)cmd.ExecuteScalar();
                return model.Id > 0;
            }
        }

        public bool DeleteFee(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Fees WHERE FeeId=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
