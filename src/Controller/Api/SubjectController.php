<?php

namespace App\Controller\Api;

use App\Entity\Subject;
use App\Entity\ApiAuditTrail;
use App\Repository\SubjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SubjectController extends AbstractController
{
    /**
     * @Route("/subject-api/delete", name="delete_subject", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/subject-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a subject
        if(!can_resource($this->getUser(), 'delete', 'subjects')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $subject = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($subject);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Subjects were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'Subject was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/subject-api/create", name="create_subject", methods={"POST"})
     */
    public function create(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/subject-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create a subject
        if(!can_resource($this->getUser(), 'create', 'subjects')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $subject = new Subject();
       
        $subject->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setIsActive(true)
        ->setCreatedBy($this->getUser())
        ;

        $errors = $validator->validate($subject);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($subject);
            $entityManager->flush();
            $response = new JsonResponse([
                'subject' => $serializer->serialize($subject, 'jsonld')
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
     * @Route("/subject-api/update/{id}", name="update_subject", methods={"PUT"})
     */
    public function update($id, Request $request, IriConverterInterface $iriConverter, SubjectRepository $subjectRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/subject-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if subject exists
        $subject = $subjectRepository->find($id);
        if(!$subject){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Subject doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update a subject
        if(!can_resource($this->getUser(), 'update', 'subjects')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
       
        $subject->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($subject);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($subject);
            $entityManager->flush();
            $response = new JsonResponse([
                'subject' => $serializer->serialize($subject, 'jsonld')
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
     * @Route("/subject-api/activate/{id}", name="activate_subject", methods={"PUT"})
    */
    public function activate($id, Request $request, SubjectRepository $subjectRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/subject-api/activate/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if subject exists
        $subject = $subjectRepository->find($id);
        if(!$subject){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Subject doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        if(!can_resource($this->getUser(), 'update', 'subjects')){

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
            $subject->setIsActive(true);
        }else{
            $subject->setIsActive(false);
        }
        $subject->setIsActiveActionAt(new \DateTimeImmutable());
        $subject->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->persist($subject);
        $entityManager->flush();

        return new JsonResponse([
            'subject' => $serializer->serialize($subject, 'jsonld')

        ], 201);
    }
}