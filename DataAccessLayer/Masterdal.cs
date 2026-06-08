using System;
using System.Collections.Generic;
using System.Linq;
using management.Models;

namespace management.DataAccessLayer
{
    /// <summary>
    /// In-memory data store. Replace the static lists with DB calls
    /// (e.g. ADO.NET / Entity Framework) when a database is wired up.
    /// </summary>
    public class Masterdal
    {
        // ─── In-memory stores ────────────────────────────────────
        private static readonly List<StudentModel>    _students   = new List<StudentModel>();
        private static readonly List<TeacherModel>    _teachers   = new List<TeacherModel>();
        private static readonly List<AttendanceModel> _attendance = new List<AttendanceModel>();
        private static readonly List<FeesModel>       _fees       = new List<FeesModel>();

        private static readonly List<SignupModel> _users = new List<SignupModel>
        {
            // default admin account
            new SignupModel { Email = "admin@school.edu", Password = "admin123", Role = "administrator", FirstName = "Admin", LastName = "User" }
        };

        private static int _studentSeq   = 1;
        private static int _teacherSeq   = 1;
        private static int _attendanceSeq = 1;
        private static int _feesSeq      = 1;

        // ─── Auth ────────────────────────────────────────────────
        public bool Login(string username, string password)
        {
            return _users.Any(u =>
                (u.Email == username || (u.FirstName + " " + u.LastName).Trim() == username)
                && u.Password == password);
        }

        public bool Register(SignupModel model)
        {
            if (_users.Any(u => u.Email == model.Email)) return false;
            _users.Add(model);
            return true;
        }

        // ─── Students ────────────────────────────────────────────
        public List<StudentModel> GetAllStudents() => _students.ToList();

        public StudentModel GetStudentById(int id) => _students.FirstOrDefault(s => s.Id == id);

        public bool AddStudent(StudentModel model)
        {
            model.Id = _studentSeq++;
            _students.Add(model);
            return true;
        }

        public bool UpdateStudent(StudentModel model)
        {
            var existing = _students.FirstOrDefault(s => s.Id == model.Id);
            if (existing == null) return false;
            _students.Remove(existing);
            _students.Add(model);
            return true;
        }

        public bool DeleteStudent(int id)
        {
            var item = _students.FirstOrDefault(s => s.Id == id);
            if (item == null) return false;
            _students.Remove(item);
            return true;
        }

        // ─── Teachers ────────────────────────────────────────────
        public List<TeacherModel> GetAllTeachers() => _teachers.ToList();

        public TeacherModel GetTeacherById(int id) => _teachers.FirstOrDefault(t => t.Id == id);

        public bool AddTeacher(TeacherModel model)
        {
            model.Id = _teacherSeq++;
            _teachers.Add(model);
            return true;
        }

        public bool UpdateTeacher(TeacherModel model)
        {
            var existing = _teachers.FirstOrDefault(t => t.Id == model.Id);
            if (existing == null) return false;
            _teachers.Remove(existing);
            _teachers.Add(model);
            return true;
        }

        public bool DeleteTeacher(int id)
        {
            var item = _teachers.FirstOrDefault(t => t.Id == id);
            if (item == null) return false;
            _teachers.Remove(item);
            return true;
        }

        // ─── Attendance ──────────────────────────────────────────
        public List<AttendanceModel> GetAllAttendance() => _attendance.ToList();

        public bool AddAttendance(AttendanceModel model)
        {
            model.Id = _attendanceSeq++;
            _attendance.Add(model);
            return true;
        }

        public bool DeleteAttendance(int id)
        {
            var item = _attendance.FirstOrDefault(a => a.Id == id);
            if (item == null) return false;
            _attendance.Remove(item);
            return true;
        }

        // ─── Fees ────────────────────────────────────────────────
        public List<FeesModel> GetAllFees() => _fees.ToList();

        public bool AddFee(FeesModel model)
        {
            model.Id = _feesSeq++;
            _fees.Add(model);
            return true;
        }

        public bool DeleteFee(int id)
        {
            var item = _fees.FirstOrDefault(f => f.Id == id);
            if (item == null) return false;
            _fees.Remove(item);
            return true;
        }
    }
}
