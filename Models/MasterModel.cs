using System;
using System.ComponentModel.DataAnnotations;

namespace management.Models
{
    // ─── Auth ───────────────────────────────────────────────
    public class LoginModel
    {
        [Required] public string Username { get; set; }
        [Required] public string Password { get; set; }
    }

    public class SignupModel
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required] public string Role { get; set; }
        [Required, MinLength(6)] public string Password { get; set; }
        [Required] public string ConfirmPassword { get; set; }
    }

    // ─── Student ─────────────────────────────────────────────
    public class StudentModel
    {
        public int Id { get; set; }
        [Required] public string Name { get; set; }
        [Required] public string FatherName { get; set; }
        [Required] public string MotherName { get; set; }
        [Required] public string Mobile { get; set; }
        [Required] public DateTime DOB { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public string Address { get; set; }
        [Required] public string Class { get; set; }
        [Required] public string Section { get; set; }
        [Required] public DateTime AdmissionDate { get; set; }
    }

    // ─── Teacher ─────────────────────────────────────────────
    public class TeacherModel
    {
        public int Id { get; set; }
        [Required] public string Name { get; set; }
        [Required] public string Subject { get; set; }
        [Required] public string Qualification { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required] public string Mobile { get; set; }
        [Required] public DateTime JoiningDate { get; set; }
        [Required] public decimal Salary { get; set; }
    }

    // ─── Attendance ───────────────────────────────────────────
    public class AttendanceModel
    {
        public int Id { get; set; }
        [Required] public string StudentName { get; set; }
        [Required] public string Class { get; set; }
        [Required] public DateTime Date { get; set; }
        [Required] public string Status { get; set; }   // Present / Absent / Late
    }

    // ─── Fees ─────────────────────────────────────────────────
    public class FeesModel
    {
        public int Id { get; set; }
        [Required] public string StudentName { get; set; }
        [Required] public string Class { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string PaymentMode { get; set; }
        [Required] public DateTime PaymentDate { get; set; }
    }
}
