<?php

namespace App\Controller\Api;

use App\Entity\Question;
use App\Entity\ApiAuditTrail;
use App\Service\UploaderHelper;
use App\Repository\QuestionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class QuestionController extends AbstractController
{
    /**
     * @Route("/question-api/delete", name="delete_question", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/question-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a question
        if(!can_resource($this->getUser(), 'delete', 'questions')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $question = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($question);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Questions were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'Question was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/question-api/create", name="create_question", methods={"POST"})
     */
    public function create(Request $request, UploaderHelper $uploaderHelper, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/question-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create a question
        if(!can_resource($this->getUser(), 'create', 'questions')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $question = new Question();
        
        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $request->files->get('explanationResource');
        if($uploadedFile){
            $newFilename = $uploaderHelper->uploadExplanationResource($uploadedFile, null);
            $question->setExplanationResource($newFilename);
        }

        $questionType = $iriConverter->getItemFromIri($request->get('questionType'));
        $subject = $iriConverter->getItemFromIri($request->get('subject'));
        $level = $iriConverter->getItemFromIri($request->get('level'));

        if(!$questionType){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Question type doesn\'t exist', 'jsonld')
            ], 404);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        if(!$subject){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Subject doesn\'t exist', 'jsonld')
            ], 404);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        if(!$level){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Level doesn\'t exist', 'jsonld')
            ], 404);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        // return new JsonResponse([
        //     'errors' => $request->get('options')
        // ])

        $question->setContent($request->get('content'))
        ->setExplanationText($request->get('explanationText'))
        ->setNoOfOptions($request->get('noOfOptions'))
        ->setOptions(\json_decode($request->get('options')))
        ->setCorrectAnswers(\json_decode($request->get('correctAnswers')))
        ->setQuestionType($questionType)
        ->setSubject($subject)
        ->setLevel($level)
        ->setCreatedBy($this->getUser())
        ;

        $errors = $validator->validate($question);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($question);
            $entityManager->flush();
            $response = new JsonResponse([
                'question' => $serializer->serialize($question, 'jsonld')
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
     * @Route("/question-api/update/{id}", name="update_question", methods={"POST"})
     */
    public function update($id, Request $request, UploaderHelper $uploaderHelper, IriConverterInterface $iriConverter, QuestionRepository $questionRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/question-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if question exists
        $question = $questionRepository->find($id);
        if(!$question){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Question doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update a question
        if(!can_resource($this->getUser(), 'update', 'questions')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $request->files->get('explanationResource');
        if($uploadedFile){
            $newFilename = $uploaderHelper->uploadExplanationResource($uploadedFile, $question->getExplanationResource());
            $question->setExplanationResource($newFilename);
        }

        $questionType = $iriConverter->getItemFromIri($request->get('questionType'));
        $subject = $iriConverter->getItemFromIri($request->get('subject'));
        $level = $iriConverter->getItemFromIri($request->get('level'));

        if(!$questionType){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Question type doesn\'t exist', 'jsonld')
            ], 404);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        if(!$subject){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Subject doesn\'t exist', 'jsonld')
            ], 404);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        if(!$level){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Level doesn\'t exist', 'jsonld')
            ], 404);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        // return new JsonResponse([
        //     'errors' => $request->get('options')
        // ])

        $question->setContent($request->get('content'))
        ->setExplanationText($request->get('explanationText'))
        ->setNoOfOptions($request->get('noOfOptions'))
        ->setOptions(\json_decode($request->get('options')))
        ->setCorrectAnswers(\json_decode($request->get('correctAnswers')))
        ->setQuestionType($questionType)
        ->setSubject($subject)
        ->setLevel($level)
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($question);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($question);
            $entityManager->flush();
            $response = new JsonResponse([
                'question' => $serializer->serialize($question, 'jsonld')
            ]);
        }

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;

    }
}