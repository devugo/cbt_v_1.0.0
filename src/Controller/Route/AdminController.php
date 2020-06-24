<?php

namespace App\Controller\Route;

use App\Repository\ExamRepository;
use App\Repository\UserRepository;
use App\Repository\LevelRepository;
use App\Repository\SubjectRepository;
use App\Repository\QuestionRepository;
use App\Repository\ExamTakenRepository;
use App\Repository\UserGroupRepository;
use App\Repository\AccountTypeRepository;
use App\Repository\NotificationRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin_dashboard")
     */
    public function index(UserRepository $userRepository, ExamTakenRepository $examTakenRepository, UserGroupRepository $userGroupRepository, SubjectRepository $subjectRepository, LevelRepository $levelRepository, QuestionRepository $questionRepository, ExamRepository $examRepository, AccountTypeRepository $accountTypeRepository, NotificationRepository $notificationRepository)
    {
        $users = $userRepository->findAllDesc();
        $examsTaken = $examTakenRepository->findAllDesc();
        $userGroups = $userGroupRepository->findAll();
        $subjects = $subjectRepository->findAll();
        $levels = $levelRepository->findAll();
        $questions = $questionRepository->findAll();
        $exams = $examRepository->findAll();
        $accountTypes = $accountTypeRepository->findAll();
        $notifications = $notificationRepository->findAll();
        $usersFive = $userRepository->recentFive();
        $examsTakenFive = $examTakenRepository->recentFive();
        
        return $this->render('admin/pages/index.html.twig', [
            'users' => $users,
            'exams_taken' => $examsTaken,
            'user_groups' => $userGroups,
            'subjects' => $subjects,
            'levels' => $levels,
            'questions' => $questions,
            'exams' => $exams,
            'account_types' => $accountTypes,
            'notifications' => $notifications,
            'users_five' => $usersFive,
            'exams_taken_five' => $examsTakenFive
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
     * @Route("/admin/results", name="admin_results")
     */
    public function results()
    {
        return $this->render('admin/pages/results.html.twig');
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
