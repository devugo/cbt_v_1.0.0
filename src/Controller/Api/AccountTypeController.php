<?php

namespace App\Controller\Api;

use App\Entity\AccountType;
use App\Entity\ApiAuditTrail;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\AccountTypeRepository;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AccountTypeController extends AbstractController
{
    /**
     * @Route("/account_type-api/delete", name="delete_account_type", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/account_type-api/delete')
            ->setUser($this->getUser());

        // check if user can delete an account type
        if(!can_resource($this->getUser(), 'delete', 'account_types')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $accType = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($accType);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Account Types were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'Account Type was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/account_type-api/create", name="create_account_type", methods={"POST"})
     */
    public function create(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/account_type-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create an account type
        if(!can_resource($this->getUser(), 'create', 'account_types')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $accType = new AccountType();
       
        $accType->setTitle('ROLE_'.\strtoupper($content['title']))
        ->setDescription($content['description'])
        ->setUsersPrivileges($content['usersPrivileges'])
        ->setSubjectsPrivileges($content['subjectsPrivileges'])
        ->setQuestionsPrivileges($content['questionsPrivileges'])
        ->setNotificationsPrivileges($content['notificationsPrivileges'])
        ->setLevelsPrivileges($content['levelsPrivileges'])
        ->setAccountTypesPrivileges($content['accountTypesPrivileges'])
        ->setUserGroupsPrivileges($content['userGroupsPrivileges'])
        ->setExamsPrivileges($content['examsPrivileges'])
        ->setCreatedBy($this->getUser())
        ;

        $errors = $validator->validate($accType);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($accType);
            $entityManager->flush();
            $response = new JsonResponse([
                'accountType' => $serializer->serialize($accType, 'jsonld')
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
     * @Route("/account_type-api/update/{id}", name="update_account_type", methods={"PUT"})
     */
    public function update($id, Request $request, IriConverterInterface $iriConverter, AccountTypeRepository $accountTypeRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/account_type-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if account type exists
        $accType = $accountTypeRepository->find($id);
        if(!$accType){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Account type doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update an account type
        if(!can_resource($this->getUser(), 'update', 'account_types')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
       
        $accType->setTitle('ROLE_'.\strtoupper($content['title']))
        ->setDescription($content['description'])
        ->setUsersPrivileges($content['usersPrivileges'])
        ->setSubjectsPrivileges($content['subjectsPrivileges'])
        ->setQuestionsPrivileges($content['questionsPrivileges'])
        ->setNotificationsPrivileges($content['notificationsPrivileges'])
        ->setLevelsPrivileges($content['levelsPrivileges'])
        ->setAccountTypesPrivileges($content['accountTypesPrivileges'])
        ->setUserGroupsPrivileges($content['userGroupsPrivileges'])
        ->setExamsPrivileges($content['examsPrivileges'])
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($accType);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($accType);
            $entityManager->flush();
            $response = new JsonResponse([
                'accountType' => $serializer->serialize($accType, 'jsonld')
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
}