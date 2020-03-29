<?php

namespace App\Controller\Api;

use App\Entity\Exam;
use App\Entity\ApiAuditTrail;
use App\Repository\ExamRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ExamController extends AbstractController
{
    /**
     * @Route("/exam-api/delete", name="delete_exam", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/exam-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a exam
        if(!can_resource($this->getUser(), 'delete', 'exams')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $exam = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($exam);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Exams were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'Exam was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/exam-api/create", name="create_exam", methods={"POST"})
     */
    public function create(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {

        $content = \json_decode($request->getContent(), true);

        $response = new JsonResponse([
            'errors' => $serializer->serialize($content, 'jsonld')
        ], 403);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create an exam
        if(!can_resource($this->getUser(), 'create', 'exams')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $exam = new Exam();
       
        $exam->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setStartFrom($content['startFrom'])
        ->setEndAfter($content['endAfter'])
        ->setDuration((int) $content['duration'])
        ->setMaximumAttempts((int) $content['maximumAttempts'])
        ->setPercentagePassMark((int) $content['percentagePassMark'])
        ->setCorrectAnswerScore((int) $content['correctAnswerScore'])
        ->setWrongAnswerScore((int) $content['wrongAnswerScore'])
        ->setAllowedIpAddresses($content['allowedIpAddresses'])
        ->setViewAnswersAfterSubmitting($content['viewAnswersAfterSubmitting'])
        ->setOpenQuiz($content['openQuiz'])
        ->setShowResultPosition($content['showResultPosition'])
        ->setAddQuestions($content['addQuestions'])
        ->setPrice((int) $content['price'])
        ->setGenerateCertificate($content['generateCertificate'])
        ->setCertificateText($content['certificateText'])
        ->setStartTime($content['startTime'])
        ->setEndTime($content['endTime'])
        ->addGroup($iriConverter->getItemFromIri($content['userGroup']))
        ->setExamType($iriConverter->getItemFromIri($content['examType']))
        ->setIsActive(true)
        ->setCreatedBy($this->getUser())
        ;

        $errors = $validator->validate($exam);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($exam);
            $entityManager->flush();
            $response = new JsonResponse([
                'exam' => $serializer->serialize($exam, 'jsonld')
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
     * @Route("/exam-api/update/{id}", name="update_exam", methods={"PUT"})
     */
    public function update($id, Request $request, IriConverterInterface $iriConverter, ExamRepository $examRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if exam exists
        $exam = $examRepository->find($id);
        if(!$exam){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Exam doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update an exam
        if(!can_resource($this->getUser(), 'update', 'exams')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        $exam->removeGroup($exam->getGroups()[0]);
       
        $exam->setTitle($content['title'])
        ->setDescription($content['description'])
        ->setStartFrom($content['startFrom'])
        ->setEndAfter($content['endAfter'])
        ->setDuration($content['duration'])
        ->setMaximumAttempts($content['maximumAttempts'])
        ->setPercentagePassMark($content['percentagePassMark'])
        ->setCorrectAnswerScore($content['correctAnswerScore'])
        ->setWrongAnswerScore($content['wrongAnswerScore'])
        ->setAllowedIpAddresses($content['allowedIpAddresses'])
        ->setViewAnswersAfterSubmitting($content['viewAnswersAfterSubmitting'])
        ->setOpenQuiz($content['openQuiz'])
        ->setShowResultPosition($content['showResultPosition'])
        ->setAddQuestions($content['addQuestions'])
        ->setPrice($content['price'])
        ->setGenerateCertificate($content['generateCertificate'])
        ->setCertificateText($content['certificateText'])
        ->setStartTime($content['startTime'])
        ->setEndTime($content['endTime'])
        ->addGroup($iriConverter->getItemFromIri($content['userGroup']))
        ->setExamType($iriConverter->getItemFromIri($content['examType']))
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($exam);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($exam);
            $entityManager->flush();
            $response = new JsonResponse([
                'exam' => $serializer->serialize($exam, 'jsonld')
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
    * @Route("/exam-api/activate/{id}", name="activate_exam", methods={"PUT"})
    */
    public function activate($id, Request $request, ExamRepository $examRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/activate/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if exam exists
        $exam = $examRepository->find($id);
        if(!$exam){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Exam doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        
        if(!can_resource($this->getUser(), 'update', 'exams')){

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
            $exam->setIsActive(true);
        }else{
            $exam->setIsActive(false);
        }
        $exam->setIsActiveActionAt(new \DateTimeImmutable());
        $exam->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->persist($exam);
        $entityManager->flush();

        return new JsonResponse([
            'exam' => $serializer->serialize($exam, 'jsonld')

        ], 201);
    }
}