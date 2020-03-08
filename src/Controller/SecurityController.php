<?php

namespace App\Controller;

use App\Entity\User;
use GuzzleHttp\Client;
use Symfony\Component\Mime\Email;
use App\Repository\UserRepository;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Mailer\Bridge\Google\Transport\GmailSmtpTransport;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class SecurityController extends AbstractController
{
    /**
     * @Route("/user-login", name="app_login", methods={"POST"})
     */
    public function login(IriConverterInterface $iriConverter, AuthenticationUtils $authenticationUtils)
    {
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout()
    {
        
    }
    //MailerInterface $mailer, 

    /**
     * @Route("/user-register", name="app_register", methods={"POST"})
     * @param User $user
     */
    public function register(\Swift_Mailer $mailer, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $userPasswordEncoder, Request $request, UserRepository $userRepository)
    {
        //\Swift_Mailer $mailer, 
        $data = json_decode($request->getContent(), true);
        $message = (new \Swift_Message('Hello Email'))
            ->setFrom('ugonnaezenwankwo@gmail.com')
            ->setTo($data['email'])
        ;
        $mailer->send($message);
        $emailExist = $userRepository->checkIfEmailExists($data['email']);
        $usernameExist = $userRepository->checkIfUsernameExists($data['username']);
        
        if($emailExist){
            throw new BadRequestHttpException('Email already exist!', null, 400);
        }
        if($usernameExist){
            throw new BadRequestHttpException('Username already exist!', null, 400);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setPassword(
            $userPasswordEncoder->encodePassword($user, $data['password'])
        );
        $user->setFirstname($data['firstname']);
        $user->setLastname($data['lastname']);
        $user->setOthernames($data['othernames']);
        $user->setAddress($data['address']);
        $user->setDob($data['dob']);
        $user->setAddress($data['address']);
        $user->setPhone($data['phone']);
        $user->setMobile($data['mobile']);
        $entityManager->persist($user);
        $entityManager->flush();


        return new JsonResponse(['user' => $user]);
    }

    /**
     * @Route("/change-password", name="app_change-password", methods={"POST"})
     */
    public function change_password(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $userPasswordEncoder, Request $request, UserRepository $userRepository)
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $old_password = $data['oldPassword'];
        $new_password = $data['newPassword'];
        
        if($userPasswordEncoder->isPasswordValid($user, $old_password)){
            $user->setPassword(
                $userPasswordEncoder->encodePassword($user, $new_password)
            );
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse([
                'message' => 'Password was changed successfully'
    
            ], 201);
        }
        return new JsonResponse([
            'message' => 'Invalid old password'

        ], 401);
    }

     /**
     * @Route("/admin-reset-password/{id}", name="app_admin-reset-password", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function admin_password_reset(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $userPasswordEncoder, Request $request, UserRepository $userRepository)
    {
        $user = $userRepository->find($id);

        $user->setPassword(
            $userPasswordEncoder->encodePassword($user, '123456')
        );
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Password was changed successfully'

        ], 201);
    }
}
