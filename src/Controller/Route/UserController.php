<?php

namespace App\Controller\Route;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/user/dashboard", name="user_dashboard")
     */
    public function index()
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserControllweController',
        ]);
    }
}
