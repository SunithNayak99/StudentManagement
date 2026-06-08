using System.Web.Mvc;
using management.DataAccessLayer;
using management.Models;

namespace management.Controllers
{
    /// <summary>
    /// Handles all data operations (CRUD) for the application.
    /// Views and page routing stay in HomeController.
    /// MasterController exposes JSON endpoints consumed by the JS layer.
    /// </summary>
    public class MasterController : Controller
    {
        private readonly Masterdal _dal = new Masterdal();

        // ─── Auth ────────────────────────────────────────────────

        [HttpPost]
        public JsonResult Login(LoginModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Invalid input." });

            bool ok = _dal.Login(model.Username, model.Password);
            return Json(new { success = ok, message = ok ? "Login successful." : "Invalid username or password." });
        }

        [HttpPost]
        public JsonResult Signup(SignupModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Invalid input." });

            if (model.Password != model.ConfirmPassword)
                return Json(new { success = false, message = "Passwords do not match." });

            bool ok = _dal.Register(model);
            return Json(new { success = ok, message = ok ? "Account created." : "Email already registered." });
        }

        // ─── Students ────────────────────────────────────────────

        [HttpGet]
        public JsonResult GetStudents()
        {
            return Json(_dal.GetAllStudents(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveStudent(StudentModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Invalid student data." });

            bool ok = model.Id == 0 ? _dal.AddStudent(model) : _dal.UpdateStudent(model);
            return Json(new { success = ok, data = model });
        }

        [HttpPost]
        public JsonResult DeleteStudent(int id)
        {
            bool ok = _dal.DeleteStudent(id);
            return Json(new { success = ok });
        }

        // ─── Teachers ────────────────────────────────────────────

        [HttpGet]
        public JsonResult GetTeachers()
        {
            return Json(_dal.GetAllTeachers(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveTeacher(TeacherModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Invalid teacher data." });

            bool ok = model.Id == 0 ? _dal.AddTeacher(model) : _dal.UpdateTeacher(model);
            return Json(new { success = ok, data = model });
        }

        [HttpPost]
        public JsonResult DeleteTeacher(int id)
        {
            bool ok = _dal.DeleteTeacher(id);
            return Json(new { success = ok });
        }

        // ─── Attendance ──────────────────────────────────────────

        [HttpGet]
        public JsonResult GetAttendance()
        {
            return Json(_dal.GetAllAttendance(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveAttendance(AttendanceModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Invalid attendance data." });

            bool ok = _dal.AddAttendance(model);
            return Json(new { success = ok, data = model });
        }

        [HttpPost]
        public JsonResult DeleteAttendance(int id)
        {
            bool ok = _dal.DeleteAttendance(id);
            return Json(new { success = ok });
        }

        // ─── Fees ────────────────────────────────────────────────

        [HttpGet]
        public JsonResult GetFees()
        {
            return Json(_dal.GetAllFees(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveFee(FeesModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Invalid fee data." });

            bool ok = _dal.AddFee(model);
            return Json(new { success = ok, data = model });
        }

        [HttpPost]
        public JsonResult DeleteFee(int id)
        {
            bool ok = _dal.DeleteFee(id);
            return Json(new { success = ok });
        }
    }
}
