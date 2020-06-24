<?php

namespace App\Controller\Route;

use App\Repository\NotificationRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    private $notificationRepository;
    private $user;

    public function __construct(NotificationRepository $notificationRepository, Security $security)
    {
        $this->notificationRepository = $notificationRepository;
        $this->user = $security->getUser();
    }

    private function getNotifications()
    {
        return $this->notificationRepository->userRecentThree($this->user);
    }

    private function getNotificationsUnreadCount()
    {
        return $this->notificationRepository->userUnread($this->user);
    }

    // public getUser()
    /**
     * @Route("/user", name="user_exams")
     */
    public function index()
    {
        return $this->render('user/pages/index.html.twig', [
            'notifications' => $this->getNotifications(),
            'no_of_unread' => $this->getNotificationsUnreadCount()
        ]);
    }

    /**
     * @Route("/user/results", name="user_results")
     */
    public function results()
    {
        return $this->render('user/pages/results.html.twig', [
            'notifications' => $this->getNotifications(),
            'no_of_unread' => $this->getNotificationsUnreadCount()
        ]);
    }
    
    /**
     * @Route("/user/account", name="user_account")
     */
    public function account()
    {
        return $this->render('user/pages/account.html.twig', [
            'notifications' => $this->getNotifications(),
            'no_of_unread' => $this->getNotificationsUnreadCount()
        ]);
    }
    
    /**
     * @Route("/user/notifications", name="user_notifications")
     */
    public function notifications()
    {
        return $this->render('user/pages/notifications.html.twig', [
            'notifications' => $this->getNotifications(),
            'no_of_unread' => $this->getNotificationsUnreadCount()
        ]);
    }
}
