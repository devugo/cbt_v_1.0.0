<?php

namespace App\Controller\Api;

use App\Entity\Notification;
use App\Entity\ApiAuditTrail;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\NotificationRepository;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class NotificationController extends AbstractController
{
    /**
     * @Route("/notification-api/delete", name="delete_notification", methods={"DELETE"})
     */
    public function delete(Request $request, IriConverterInterface $iriConverter, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $iris = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('DELETE')
            ->setRequestData($iris)
            ->setEndpoint(base_url() . '/notification-api/delete')
            ->setUser($this->getUser());

        // check if user can delete a notification
        if(!can_resource($this->getUser(), 'delete', 'notifications')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        foreach($iris as $iri){
            $notification = $iriConverter->getItemFromIri($iri);
            // if($this>getUser()->getIsAdmin() === false){
            //     continue;
            // }
            $entityManager->remove($notification);
        }
        
        if(count($iris) > 1){
            $response = new JsonResponse([
                'message' => 'Notifications were deleted successfully'
            ], 201);
        }else{
            $response = new JsonResponse([
                'message' => 'Notification was deleted successfully'
            ], 201);
        }

        $api_audit_trail->setResponseData((array) $response);

        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail
        
        return $response;
    }

     /**
     * @Route("/notification-api/create", name="create_notification", methods={"POST"})
     */
    public function create(Request $request, IriConverterInterface $iriConverter, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('POST')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/notification-api/create')
            ->setUser($this->getUser())
        ;
        // check if user can create a notification
        if(!can_resource($this->getUser(), 'create', 'notifications')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied. You can\'t create nomtification', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
        $sentNotifications = array(); // Store all sent notifications
       
        // create notification for all the users selected
        foreach($content['sentTo'] as $iri){
            $notification = new Notification();
            $user = $iriConverter->getItemFromIri($iri);
            if(!$user){
                // skip to next loop if user doesn't exist
                continue;
            }
            $notification->setTitle($content['title'])
                ->setMessage($content['message'])
                ->setSentBy($this->getUser())
                ->setSentTo($user)
                ->setActionLink($content['actionLink'])
            ;
            $entityManager->persist($notification);
            $entityManager->flush();

            array_push($sentNotifications, $notification);
        }
    
        $response = new JsonResponse([
            'notifications' => $serializer->serialize($sentNotifications, 'jsonld')
        ]);

        // continue audit trail
        $api_audit_trail->setResponseData((array) $response);
        $entityManager->persist($api_audit_trail);
        $entityManager->flush();
        // End Store request trail

        return $response;

    }

     /**
     * @Route("/notification-api/update/{id}", name="update_notification", methods={"PUT"})
     */
    public function update($id, Request $request, IriConverterInterface $iriConverter, NotificationRepository $notificationRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $content = \json_decode($request->getContent(), true);

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setRequestData($content)
            ->setEndpoint(base_url() . '/notification-api/update/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if notification exists
        $notification = $notificationRepository->find($id);
        if(!$notification){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Notification doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can update a notification
        if(!can_resource($this->getUser(), 'update', 'notifications')){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }
       
        $notification->setTitle($content['title'])
        ->setMessage($content['message'])
        ->setActionLink($content['actionLink'])
        ->setSeenAt(NULL)
        ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($notification);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($notification);
            $entityManager->flush();
            $response = new JsonResponse([
                'notification' => $serializer->serialize($notification, 'jsonld')
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
     * @Route("/notification-api/view/{id}", name="view_notification", methods={"PUT"})
     */
    public function view($id, Request $request, IriConverterInterface $iriConverter, NotificationRepository $notificationRepository, ValidatorInterface $validator, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setEndpoint(base_url() . '/notification-api/view/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if notification exists
        $notification = $notificationRepository->find($id);
        if(!$notification){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Notification doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        // check if user can view a notification
        if($this->getUser() !== $notification->getSentBy() && $this->getUser() !== $notification->getSentTo()){

            $response = new JsonResponse([
                'errors' => $serializer->serialize('Access denied', 'jsonld')
            ], 403);
            
            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        $notification->setSeenAt(new \DateTimeImmutable())
            ->setUpdatedAt(new \DateTimeImmutable())
        ;

        $errors = $validator->validate($notification);
        if(count($errors) > 0){
            $response = new JsonResponse([
                'errors' => $serializer->serialize($errors, 'jsonld')
            ], 401); 
        }else{
            $entityManager->persist($notification);
            $entityManager->flush();
            $response = new JsonResponse([
                'notification' => $serializer->serialize($notification, 'jsonld')
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
     * @Route("/notification-api/mark/{id}", name="mark_notification", methods={"PUT"})
     */
    public function mark($id, Request $request, NotificationRepository $notificationRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {

        // Store request trail
        $api_audit_trail = new ApiAuditTrail();
        $api_audit_trail->setTypeOfRequest('PUT')
            ->setEndpoint(base_url() . '/notification-api/mark/'.$id)
            ->setUser($this->getUser())
        ;
        
        // check if notification exists
        $notification = $notificationRepository->find($id);
        if(!$notification){
            $response = new JsonResponse([
                'errors' => $serializer->serialize('Notification doesn\'t exist', 'jsonld')
            ], 401);

            $api_audit_trail->setResponseData((array) $response);
            $entityManager->persist($api_audit_trail);
            $entityManager->flush();
            
            return $response;
        }

        if(count($this->getUser()->getRoles()) === 1){
            if($this->getUser() == $notification->getSentTo()){
                if($notification->getSeenAt() == NULL){
                    $notification->setSeenAt(new \DateTimeImmutable());
                }
                $notification->setUpdatedAt(new \DateTimeImmutable());
                $entityManager->persist($notification);
                $entityManager->flush();
        
                return new JsonResponse([
                    'notification' => $serializer->serialize($notification, 'jsonld')
        
                ], 201);
            }else {
                $response = new JsonResponse([
                    'errors' => $serializer->serialize('Access denied', 'jsonld')
                ], 403);
                
                $api_audit_trail->setResponseData((array) $response);
                $entityManager->persist($api_audit_trail);
                $entityManager->flush();
                
                return $response;
            }
        }
        
        if(!can_resource($this->getUser(), 'update', 'notifications')){

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

        if($notification->getSeenAt() == NULL){
            $notification->setSeenAt(new \DateTimeImmutable());
        }else{
            $notification->setSeenAt(NULL);
        }
        $notification->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->persist($notification);
        $entityManager->flush();

        return new JsonResponse([
            'notification' => $serializer->serialize($notification, 'jsonld')

        ], 201);
    }
}
