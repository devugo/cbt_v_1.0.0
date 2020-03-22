<?php

namespace App\Controller\Api;

use App\Entity\UserGroup;
use App\Entity\ApiAuditTrail;
use App\Repository\UserGroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserGroupController extends AbstractController
{
    /**
     * @Route("/user_group-api/delete", name="delete_user_group", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/user_group-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a user group
        if(!can_resource($this->getUser(), 'delete', 'user_groups')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $userGroup = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($userGroup);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'User Groups were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'User Group was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/user_group-api/create", name="create_user_group", methods={"POST"})
     */
    public function create(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/user_group-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create a user group
        if(!can_resource($this->getUser(), 'create', 'user_groups')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $userGroup = new UserGroup();
       
        $userGroup->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setDaysValidity($content['daysValidity'])
        ->setCost($content['cost'])
        ->setIsActive(true)
        ->setCreatedBy($this->getUser())
        ;

        $errors = $validator->validate($userGroup);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($userGroup);
            $entityManager->flush();
            $response = new JsonResponse([
                'userGroup' => $serializer->serialize($userGroup, 'jsonld')
            ]);
        }

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;

    }

     /**
     * @Route("/user_group-api/update/{id}", name="update_user_group", methods={"PUT"})
     */
    public function update($id, Request $request, IriConverterInterface $iriConverter, UsergroupRepository $userGroupRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/user_group-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if user group exists
        $userGroup = $userGroupRepository->find($id);
        if(!$userGroup){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('User group doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update a user group
        if(!can_resource($this->getUser(), 'update', 'user_groups')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
       
        $userGroup->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setCost($content['cost'])
        ->setDaysValidity($content['daysValidity'])
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($userGroup);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($userGroup);
            $entityManager->flush();
            $response = new JsonResponse([
                'userGroup' => $serializer->serialize($userGroup, 'jsonld')
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
     * @Route("/user_group-api/activate/{id}", name="activate_user_group", methods={"PUT"})
    */
    public function activate($id, Request $request, UserGroupRepository $userGroupRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/user_group-api/activate/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if user group exists
        $userGroup = $userGroupRepository->find($id);
        if(!$userGroup){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('User group doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        if(!can_resource($this->getUser(), 'update', 'user_groups')){

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
            $userGroup->setIsActive(true);
        }else{
            $userGroup->setIsActive(false);
        }
        $userGroup->setIsActiveActionAt(new \DateTimeImmutable());
        $userGroup->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->persist($userGroup);
        $entityManager->flush();

        return new JsonResponse([
            'userGroup' => $serializer->serialize($userGroup, 'jsonld')

        ], 201);
    }
}