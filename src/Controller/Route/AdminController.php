<?php

namespace App\Controller\Route;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin_dashboard")
     */
    public function index()
    {
        return $this->render('admin/pages/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    /**
     * @Route("/admin/users", name="admin_users")
     */
    public function users()
    {
        return $this->render('admin/pages/users.html.twig');
    }

    /**
     * @Route("/admin/user-groups", name="admin_user_groups")
     */
    public function user_groups()
    {
        return $this->render('admin/pages/user-groups.html.twig');
    }

    /**
     * @Route("/admin/subjects", name="admin_subjects")
     */
    public function subjects()
    {
        return $this->render('admin/pages/subjects.html.twig');
    }

    /**
     * @Route("/admin/questions", name="admin_questions")
     */
    public function questions()
    {
        return $this->render('admin/pages/questions.html.twig');
    }

    /**
     * @Route("/admin/levels", name="admin_levels")
     */
    public function levels()
    {
        return $this->render('admin/pages/levels.html.twig');
    }

    /**
     * @Route("/admin/exams", name="admin_exams")
     */
    public function exams()
    {
        return $this->render('admin/pages/exams.html.twig');
    }

    /**
     * @Route("/admin/account-types", name="admin_account_types")
     */
    public function account_types()
    {
        return $this->render('admin/pages/account-types.html.twig');
    }

    /**
     * @Route("/admin/notifications", name="admin_notifications")
     */
    public function notifications()
    {
        return $this->render('admin/pages/notifications.html.twig');
    }

    /**
     * @Route("/admin/profile", name="admin_profile")
     */
    public function profile()
    {
        return $this->render('admin/pages/profile.html.twig');
    }

     /**
     * @Route("/admin/settings", name="admin_settings")
     */
    public function settings()
    {
        return $this->render('admin/pages/settings.html.twig');
    }
}
