<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class LoginFormAuthenticator extends AbstractGuardAuthenticator
{
    private $userRepository;
    private $router;
    private $passwordEncoder;
    private $iriConverter;
    private $serializer;
    
    public function __construct(SerializerInterface $serializer, IriConverterInterface $iriConverter, UserRepository $userRepository, RouterInterface $router, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->userRepository = $userRepository;
        $this->router = $router;
        $this->passwordEncoder = $passwordEncoder;
        $this->iriConverter = $iriConverter;
        $this->serializer = $serializer;
    }
    public function supports(Request $request)
    {
        return $request->attributes->get('_route') === 'app_login'
            && $request->isMethod('POST');
    }

    public function getCredentials(Request $request)
    {
        return json_decode($request->getContent(), true);
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        return $this->userRepository->userExistByUsernameOrEmail($credentials['email']);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        return $this->passwordEncoder->isPasswordValid($user, $credentials['password']);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse([
            'error' => 'Invalid credentials'
        ], 401);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        $userLoggedIn = $token->getUser();
        return new JsonResponse([
            'username' => $userLoggedIn->getUsername(),
            'iri' => $this->iriConverter->getIriFromItem($userLoggedIn),
            'roles' => $userLoggedIn->getRoles(),
        ]);
        // return new JsonResponse([
        //     'user' => $this->serializer->serialize($userLoggedIn, 'jsonld')
        // ]);
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        // todo
    }

    public function supportsRememberMe()
    {
        return true;
    }
}
