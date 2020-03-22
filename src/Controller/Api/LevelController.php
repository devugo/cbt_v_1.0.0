<?php

namespace App\Controller\Api;

use App\Entity\Level;
use App\Entity\ApiAuditTrail;
use App\Repository\LevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LevelController extends AbstractController
{
    /**
     * @Route("/level-api/delete", name="delete_level", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/level-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a level
        if(!can_resource($this->getUser(), 'delete', 'levels')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $level = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($level);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Levels were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'Level was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/level-api/create", name="create_level", methods={"POST"})
     */
    public function create(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/level-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create a level
        if(!can_resource($this->getUser(), 'create', 'levels')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $level = new Level();
       
        $level->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setCreatedBy($this->getUser())
        ;

        $errors = $validator->validate($level);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($level);
            $entityManager->flush();
            $response = new JsonResponse([
                'level' => $serializer->serialize($level, 'jsonld')
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
     * @Route("/level-api/update/{id}", name="update_level", methods={"PUT"})
     */
    public function update($id, Request $request, IriConverterInterface $iriConverter, LevelRepository $levelRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/level-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if level exists
        $level = $levelRepository->find($id);
        if(!$level){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Level doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update a level
        if(!can_resource($this->getUser(), 'update', 'levels')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
       
        $level->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($level);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($level);
            $entityManager->flush();
            $response = new JsonResponse([
                'level' => $serializer->serialize($level, 'jsonld')
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