<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\ApiAuditTrail;
use App\Service\UploaderHelper;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractController
{
    /**
     * @Route("/user-api/delete", name="delete_user", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager, UploaderHelper $uploadHelper)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/user-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a user
        if(!can_resource($this->getUser(), 'delete', 'users')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $user = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($user);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Users were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'User was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

    /**
     * @Route("/user-api/create", name="create_user", methods={"POST"})
     */
    public function create(Request $request, UserPasswordEncoderInterface $passwordEncoder, IriConverterInterface $iriConverter, UserRepository $userRepository, ValidatorInterface $validator, UploaderHelper $uploaderHelper, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData((array) $request)
            ->setEndpoint(base_url() . '/user-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create a user
        if(!can_resource($this->getUser(), 'create', 'users')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        $user = new User();

        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $request->files->get('image');
        if($uploadedFile){
            $newFilename = $uploaderHelper->uploadUserAvatar($uploadedFile, null);
            $user->setPhoto($newFilename);
        }

        $plainPassword = default_password();
        $encoded = $passwordEncoder->encodePassword($user, $plainPassword);

        $userGroup = $iriConverter->getItemFromIri($request->get('userGroup'));

        $user->setFirstname($request->get('firstname'))
            ->setLastname($request->get('lastname'))
            ->setOthernames($request->get('othernames'))
            ->setDob($request->get('dob'))
            ->setSex($request->get('sex'))
            ->setUsername($request->get('username'))
            ->setEmail($request->get('email'))
            ->setPassword($encoded)
            ->setUserGroup($userGroup)
            ->setIsActive(true)
        ;

        if($request->get('accountType')){
            $accType = $iriConverter->getItemFromIri($request->get('accountType'));
            $user->setAccountType($accType)
                ->setRoles(["ROLE_ADMIN"]);
        }

        $errors = $validator->validate($user);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($user);
            $entityManager->flush();
            $response = new JsonResponse([
                'user' => $serializer->serialize($user, 'jsonld')
            ]);
        }

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        ;
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;
    }

     /**
     * @Route("/user-api/update/{id}", name="update_user", methods={"POST"})
     */
    public function update($id, Request $request, UserRepository $userRepository, ValidatorInterface $validator, UploaderHelper $uploaderHelper, SerializerInterface $serializer, IriConverterInterface $iriConverter, EntityManagerInterface $entityManager)
    {
        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData((array) $request)
            ->setEndpoint(base_url() . '/user-api/update/'.$id)
            ->setUser($this->getUser())
        ;
         
        // check if user exists
        $user = $userRepository->find($id);
        if(!$user){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('User doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        if($user !== $this->getUser() && !can_resource($this->getUser(), 'update', 'users')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $request->files->get('image');
        if($uploadedFile){
            $newFilename = $uploaderHelper->uploadUserAvatar($uploadedFile, $user->getPhoto());
            $user->setPhoto($newFilename);
        }
        
        $userGroup = $iriConverter->getItemFromIri($request->get('userGroup'));
       
        /** @var User $user */
        $user->setFirstname($request->get('firstname'))
            ->setLastname($request->get('lastname'))
            ->setOthernames($request->get('othernames'))
            ->setDob($request->get('dob'))
            ->setSex($request->get('sex'))
            ->setUsername($request->get('username'))
            ->setEmail($request->get('email'))
            ->setUserGroup($userGroup)
            ->setUpdatedAt(new \DateTimeImmutable())
        ;
        
        if($request->get('accountType')){
            $accType = $iriConverter->getItemFromIri($request->get('accountType'));
            $user->setAccountType($accType)
                ->setRoles(["ROLE_ADMIN"]);
        }

        $errors = $validator->validate($user);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($user);
            $entityManager->flush();
            $response = new JsonResponse([
                'user' => $serializer->serialize($user, 'jsonld')
            ]);
        }

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        ;
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;
    }

     /**
     * @Route("/user-api/activate/{id}", name="activate_user", methods={"PUT"})
     */
    public function activate($id, Request $request, UserRepository $userRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/user-api/activate/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if user exists
        $user = $userRepository->find($id);
        if(!$user){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('User doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        if(!can_resource($this->getUser(), 'update', 'users')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // if($this->getUser()->getIsAdmin() === false){
        //     return new JsonResponse([
        //         'message' => 'Access Denied!'
        //     ], 401); 
        // }

        if($content['type'] === 'activate'){
            $user->setIsActive(true);
        }else{
            $user->setIsActive(false);
        }
        $user->setIsActiveActionAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            'user' => $serializer->serialize($user, 'jsonld')

        ], 201);
    }
}