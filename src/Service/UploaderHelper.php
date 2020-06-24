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
use Symfony\Component\Filesystem\Exception\FileNotFoundException;

class UploaderHelper
{
    const USER_AVATARS = 'user_avatars';
    const EXPLANATION_RESOURCES = 'explanation_resources';
    const QUESTION_IMAGES = 'question_images';

    private $uploadsPath;
    private $filesystem;
    private $userRepository;
    private $iriConverter;
    private $security;
    private $entityManager;

    public function __construct(string $uploadsPath, Filesystem $filesystem, UserRepository $userRepository, IriConverterInterface $iriConverter, Security $security, EntityManagerInterface $entityManager)
    {
        $this->uploadsPath = $uploadsPath;
        $this->filesystem = $filesystem;
        $this->userRepository = $userRepository;
        $this->iriConverter = $iriConverter;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    public function uploadUserAvatar(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'.self::USER_AVATARS;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename) {
            $this->delete_image_from_storage($existingFilename, self::USER_AVATARS);
            
        }

        return $newFilename;
    }

    public function uploadExplanationResource(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'.self::EXPLANATION_RESOURCES;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename) {
            $this->delete_image_from_storage($existingFilename, self::EXPLANATION_RESOURCES);
            
        }

        return $newFilename;
    }

    public function uploadQuestionImage(UploadedFile $uploadedFile, ?string $existingFilename): string
    {
        $destination = $this->uploadsPath.'/'.self::QUESTION_IMAGES;

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME); // original client name without file extension
        $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();

        $uploadedFile->move(
            $destination,
            $newFilename
        );

        if($existingFilename) {
            $this->delete_image_from_storage($existingFilename, self::QUESTION_IMAGES);
            
        }

        return $newFilename;
    }

    public function delete_image_from_storage($filename, $path)
    {
        try {
            $result = $this->filesystem->remove($this->uploadsPath.'/'.$path.'/'.$filename);
            if($result === false){
                throw new \Exception(sprintf('Could not delete old uploaded avatar "%s"', $existingFilename));
            }
        } catch(FileNotFoundException $e) {
            $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to delete', $existingFilename));
        }
    }
    
}