<?php

namespace App\Controller\Route;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="login_page")
     */
    public function login()
    {
        return $this->render('security/login.html.twig');
    }
}