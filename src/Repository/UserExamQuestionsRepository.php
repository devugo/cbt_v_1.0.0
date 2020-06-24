<?php

namespace App\Repository;

use App\Entity\UserExamQuestions;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method UserExamQuestions|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserExamQuestions|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserExamQuestions[]    findAll()
 * @method UserExamQuestions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserExamQuestionsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserExamQuestions::class);
    }

    // /**
    //  * @return UserExamQuestions[] Returns an array of UserExamQuestions objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserExamQuestions
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
