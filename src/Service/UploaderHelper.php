<?php

namespace App\Service;

use App\Entity\Result;
use Gedmo\Sluggable\Util\Urlizer;
use App\Repository\UserRepository;
use App\Repository\ResultRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\SchoolClassRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploaderHelper
{
    const SCHOOL_LOGOS = 'school_logos';
    const STUDENT_AVATARS = 'student_avatars';
    const TEACHER_AVATARS = 'teacher_avatars';
    const HEAD_SIGNATURES = 'head_signatures';

    private $uploadsPath;
    private $filesystem;
    private $schoolClassRepository;
    private $resultRepository;
    private $userRepository;
    private $iriConverter;
    private $security;
    private $entityManager;

    public function __construct(string $uploadsPath, Filesystem $filesystem, SchoolClassRepository $schoolClassRepository, ResultRepository $resultRepository, UserRepository $userRepository, IriConverterInterface $iriConverter, Security $security, EntityManagerInterface $entityManager)
    {
        $this->uploadsPath = $uploadsPath;
        $this->filesystem = $filesystem;
        $this->schoolClassRepository = $schoolClassRepository;
        $this->resultRepository = $resultRepository;
        $this->userRepository = $userRepository;
        $this->iriConverter = $iriConverter;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }
    public function uploadSchoolLogo(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'. self::SCHOOL_LOGOS;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename){
            $this->delete_image_from_storage($existingFilename, self::SCHOOL_LOGOS);
        }

        return $newFilename;
    }

    public function uploadStudentAvatar(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'.self::STUDENT_AVATARS;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename) {
            $this->delete_image_from_storage($existingFilename, self::STUDENT_AVATARS);
            
        }

        return $newFilename;
    }

    public function uploadTeacherAvatar(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'.self::TEACHER_AVATARS;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename) {
            $this->delete_image_from_storage($existingFilename, self::TEACHER_AVATARS);
        }

        return $newFilename;
    }

    public function uploadSignature(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'.self::HEAD_SIGNATURES;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename) {
            $this->delete_image_from_storage($existingFilename, self::HEAD_SIGNATURES);
        }

        return $newFilename;
    }

    public function delete_image_from_storage($filename, $path)
    {
        try {
            $result = $this->filesystem->remove($this->uploadsPath.'/'.$path.'/'.$filename);
            if($result === false){
                throw new \Exception(sprintf('Could not delete old uploaded logo "%s"', $existingFilename));
            }
        } catch(FileNotFoundException $e) {
            $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to delete', $existingFilename));
        }
    }

    // public function uploadResult(UploadedFile $uploadedFile, $fileTmpName, string $class): string
    // {
    //     $fileExtension = $uploadedFile->getClientOriginalExtension(); // get file extension

    //     $session = $this->security->getUser()->getUsers()[0]->getSettings()->getSession(); // Session objkect

    //     $term = $this->security->getUser()->getUsers()[0]->getSettings()->getTerm(); // Term object

    //     $class = $this->schoolClassRepository->find($class); // Class object

    //     $school = $this->security->getUser()->getUsers()[0]; // School object

    //     if($fileExtension !== 'csv'){
    //         // throw new \Exception(sprintf('Please upload a csv file.'));
    //         throw $this->createException('Please upload a csv file');
    //     }
    //     $errors = array(); // Array to store errors encountered

    //     $handle = \fopen($fileTmpName, 'r');
    //     $j = 0; // Monitor the csv file and move to next row once a previous row is done
    //     while(($myData = fgetcsv($handle, 1000, ',')) !== FALSE){
    //         if($j > 0){
    //             $regno = $myData[0]; // reg no
    //             $test = $myData[1]; // test score
    //             $exam = $myData[2]; // exam score
    //             $teacher_comment = $myData[3]; // teacher comment
    //             $head_comment = $myData[4]; // head of school comment
    //             // $student = $this->iriConverter->getItemFromIri($iri);
    //             $student = $this->userRepository->findOneBy(['regno' => $regno]);
                 
    //             //Check if regno contains the code of student
    //             $school_code = $this->security->getUser()->getUsers()[0]->getCode();
    //             if(\substr($regno, 0, strlen($school_code)) !== $school_code){
    //                 \array_push($errors, 'Invalid registration no '.$regno);
    //                 continue;
    //             }
    //             if (!$student){
    //                 \array_push($errors, 'Student with regno '.$regno. ' doesnt\'t exist ');
    //                 continue; // Skip to the next loop if student doesn't exist
    //             }
    //             $student_id = $student->getId();

    //             // Check idf result has been uploaded before
    //             // $result = null;
    //             $result = $this->resultRepository->findOneBy(
    //                 [
    //                     'class' => $class, 
    //                     'session' => $session, 
    //                     'term' => $term, 
    //                     'student' => $student
    //                 ]
    //             );
    //             if($result){
    //                 $result->setExam($exam)
    //                     ->setTest($test)
    //                     ->setTeacherComment($teacher_comment)
    //                     ->setHeadComment($head_comment)
    //                 ;
    //             }else {
    //                 $result = new Result();
    //                 $result->setClass($class)
    //                     ->setSession($session)
    //                     ->setTerm($term)
    //                     ->setStudent($student)
    //                     ->setRegno($regno)
    //                     ->setExam($exam)
    //                     ->setTest($test)
    //                     ->setTeacherComment($teacher_comment)
    //                     ->setHeadComment($head_comment)
    //                     ->setSchool($school)
    //                 ;

    //                 $bundle = $this->security->getUser()->getUsers()[0]->getBundle();

    //                 if($bundle){
    //                     $bundle->setNoOfStudents($bundle->getNoOfStudents() - 1);
    //                     $this->entityManager->persist($bundle);
    //                 }

    //             }

                

    //             $this->entityManager->persist($result);

    //         }
    //         $j++;
    //     }
        
    //     $this->entityManager->flush();
    //     return \json_encode($errors);
    // }
}