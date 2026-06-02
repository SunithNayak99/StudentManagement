using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace management.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return RedirectToAction("Login");
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Signup()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult StudentRegistration()
        {
            return View();
        }

        public ActionResult TeacherAdd()
        {
            return View();
        }

        public ActionResult ClassCreation()
        {
            return View();
        }

        public ActionResult SubjectManagement()
        {
            return View();
        }

        public ActionResult Attendance()
        {
            return View();
        }

        public ActionResult FeesCollection()
        {
            return View();
        }

        public ActionResult ExamManagement()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
    }
}