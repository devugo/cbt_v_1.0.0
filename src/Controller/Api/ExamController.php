<?php

namespace App\Controller\Api;

use App\Entity\Exam;
use App\Entity\ExamTaken;
use App\Entity\ApiAuditTrail;
use App\Entity\UserExamQuestions;
use App\Repository\ExamRepository;
use App\Repository\QuestionRepository;
use App\Repository\ExamTakenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use App\Repository\UserExamQuestionsRepository;
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
        ->setShuffleQuestions($content['shuffleQuestions'])
        ->setShuffleOptions($content['shuffleOptions'])
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
        ->setShuffleQuestions($content['shuffleQuestions'])
        ->setShuffleOptions($content['shuffleOptions'])
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

        $response = new JsonResponse([
            'exam' => $serializer->serialize($exam, 'jsonld')

        ], 201);

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;
  
    }

     /**
     * @Route("/exam-api/add_questions", name="add_questions_to_exams", methods={"POST"})
     */
    public function add_questions(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);
        $exams = $content['exams'];
        $questions = $content['questions'];

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/add_questions/')
            ->setUser($this->getUser())
        ;

        foreach($exams as $examIRI){
            $exam = $iriConverter->getItemFromIri($examIRI);

            if($exam){
                foreach($questions as $questionIRI){
                    $question = $iriConverter->getItemFromIri($questionIRI);
                    if($question){
                        $exam->addQuestion($question);
                        $entityManager->persist($exam);
                    }
                }
            }
        }

        $response = new JsonResponse([
            'message' => $serializer->serialize("Questions added to exams", 'jsonld')

        ], 201);
        
        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
  
        return $response;
        
    }

    /**
     * @Route("/exam-api/remove_question", name="remove_question_from_exam", methods={"DELETE"})
     */
    public function remove_question(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);
        $exam = $content['exam'];
        $question = $content['question'];

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/remove_question')
            ->setUser($this->getUser())
        ;

        $question = $iriConverter->getItemFromIri($question);
        $exam = $iriConverter->getItemFromIri($exam);

        $question->removeExam($exam);
        $entityManager->persist($question);
        $entityManager->flush();

        $response = new JsonResponse([
            'question' => $serializer->serialize($question, 'jsonld')

        ], 201);
        
        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
  
        return $response;
    }
    
    /**
     * @Route("/exam-api/generate_questions/{id}", name="generate_questions_to_exam", methods={"POST"})
     */
    public function generate_questions($id, Request $request, ExamRepository $examRepository, QuestionRepository $questionRepository, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/generate_questions/'.$id)
            ->setUser($this->getUser())
        ;

        $level = $iriConverter->getItemFromIri($content['level']);
        $subject = $iriConverter->getItemFromIri($content['subject']);
        $no_of_questions = $content['noOfQuestions'];
        $exam = $examRepository->find($id);
        
        // Get all questions based on level and subjects
        $questions = $questionRepository->findBy(['level' => $level, 'subject' => $subject]);
        
        //  Get already added questions if any exists
        $existing_questions = $exam->getQuestions();

        //  Get no of questions left to add
        $no_of_questions_left = \count($questions) - \count($existing_questions);
        
        // convert no of questions to integer to get the required value of questions
        $no_of_questions = (int) $no_of_questions; 

        if($no_of_questions_left < $no_of_questions){
            $response = new JsonResponse([
                'errors' => $serializer->serialize(\sprintf('Available questions ("%s") isn\'t up to the specified questions to generate. Please, add more questions or reduce the no of questions for exam', $no_of_questions_left), 'jsonld')
            ], 401);
              // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        //  Shuffle questions
        \shuffle($questions);        

        

        //  Add questiosns to exam
        foreach($questions as $question){
            if($no_of_questions < 1){
                break;
            }
            //  Check if added questions is more than one
            if(count($existing_questions) > 0){
                //  controller to keep control if a question already exist
                $checker = 0;
                foreach($existing_questions as $ex_q){
                    if($ex_q == $question){
                        $checker = 1;
                        break; // If question haa been added before end loop
                    }
                }

                if($checker > 0){
                    continue; // Contiue to next available question if question is already exist
                }
                // if(\in_array($question, $existing_questions)){
                //     continue; // If question haa been added before skip and get the next question
                // }
            }
            $exam->addQuestion($question);
            $entityManager->persist($exam);
            
            $no_of_questions--;
        }

        $entityManager->persist($exam);
        $entityManager->flush();

        $response = new JsonResponse([
            'exam' => $serializer->serialize($exam, 'jsonld')

        ], 201);
        
        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
  
        return $response;
    }

    /**
     * @Route("/exam-api/take_exam", name="take_exam", methods={"POST"})
     */
    public function take_exam(Request $request, ExamTakenRepository $examTakenRepository, ExamRepository $examRepository, QuestionRepository $questionRepository, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);
        $user = $this->getUser();

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/take_exam')
            ->setUser($this->getUser())
        ;

        $exam = $content['exam'];

        $exam = $iriConverter->getItemFromIri($exam);

        //  If exam doesn't exist
        if(!$exam){
            $response =  new JsonResponse([
                'errors' => $serializer->serialize('Invalid exam', 'jsonld')
            ], 401);

            // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        // Check if exam is active
        if(!$exam->getIsActive()){
            $response =  new JsonResponse([
                'errors' => $serializer->serialize('Exam is not active', 'jsonld')
            ], 401);

            // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        $examMaximumAttempts = $exam->getMaximumAttempts();

        $examTakens = $examTakenRepository->findBy(['user' => $user, 'exam' => $exam]);

        $userExamMaximumAttempts = \count($examTakens);

        $userRoles = $user->getRoles();

        if(!in_array("ROLE_ADMIN", $userRoles) && $userExamMaximumAttempts >= $examMaximumAttempts){
            $response =  new JsonResponse([
                'errors' => $serializer->serialize('You have reached the maximum attempts of exam', 'jsonld')
            ], 401);

            // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        $questions = $exam->getQuestions();

        if(\count($questions) == 0){
            $response =  new JsonResponse([
                'errors' => $serializer->serialize('Questions are not available', 'jsonld')
            ], 401);

            // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        $examTaken = new ExamTaken();
        $examTaken->setUser($user)
            ->setExam($exam)
        ;
        $entityManager->persist($examTaken);
        $entityManager->flush();


        foreach($questions as $question){
            $userQuestion = new UserExamQuestions();
            $userQuestion->setUser($user)
                ->setQuestion($question)
                ->setExam($exam)
                ->setQuestionType($question->getQuestionType())
                ->setContent($question->getContent())
                ->setExplanationText($question->getExplanationText())
                ->setNoOfOptions($question->getNoOfOptions())
                ->setOptions($question->getOptions())
                ->setCorrectAnswers($question->getCorrectAnswers())
                ->setImage($question->getImage())
                ->setExplanationResource($question->getExplanationResource())
                ->setExamTaken($examTaken)
            ;

            $entityManager->persist($userQuestion);

            $entityManager->flush();
        }

        $userQuestions = $examTaken->getUserExamQuestion();

        $returnQuestions = array();
        foreach($userQuestions as $question){
            \array_push($returnQuestions, $question);
        };

        $response = new JsonResponse([
            'examTaken' => $serializer->serialize($examTaken, 'jsonld')
        ], 201);

        // $response = new JsonResponse([
        //     'questions' => json_encode($examTaken)
        // ], 201);

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;

    }

    /**
     * @Route("/exam-api/submit_answer/{id}", name="submit_answer", methods={"PUT"})
     */
    public function submit_answer($id, Request $request, UserExamQuestionsRepository $userQuestionsRepository, ExamTakenRepository $examTakenRepository, ExamRepository $examRepository, QuestionRepository $questionRepository, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/submit_answer/'.$id)
            ->setUser($this->getUser())
        ;

        $userQuestion = $userQuestionsRepository->find($id);
        $answer = $content['answer'];

        if(!$userQuestion){
            $response =  new JsonResponse([
                'errors' => $serializer->serialize('Invalid question', 'jsonld')
            ], 401);

            // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        $userQuestion->setChosenAnswers($answer)
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $entityManager->persist($userQuestion);
        $entityManager->flush();

        $response = new JsonResponse([
            'userQuestion' => $serializer->serialize($userQuestion, 'jsonld')
        ], 201);

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;

    }

    /**
     * @Route("/exam-api/submit_exam/{id}", name="submit_exam", methods={"PUT"})
     */
    public function submit_exam($id, Request $request, ExamTakenRepository $examTakenRepository, ExamRepository $examRepository, QuestionRepository $questionRepository, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/exam-api/submit_exam/'.$id)
            ->setUser($this->getUser())
        ;

        $examTaken = $examTakenRepository->find($id);

        if(!$examTaken){
            $response =  new JsonResponse([
                'errors' => $serializer->serialize('Invalid question', 'jsonld')
            ], 401);

            // continue audit trail
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            // End Store request trail

            return $response;
        }

        $examTaken->setSubmittedAt(new \DateTimeImmutable())
            ->setUpdatedAt(new \DateTimeImmutable())
            ->setTimeSpent($content['timeSpent'])
            ->setTimeLeft($content['timeLeft'])
        ;

        $entityManager->persist($examTaken);
        $entityManager->flush();

        $response = new JsonResponse([
            'examTaken' => $serializer->serialize($examTaken, 'jsonld')
        ], 201);

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;

    }
}