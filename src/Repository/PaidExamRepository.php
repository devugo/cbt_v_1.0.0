<?php

namespace App\Repository;

use App\Entity\PaidExam;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method PaidExam|null find($id, $lockMode = null, $lockVersion = null)
 * @method PaidExam|null findOneBy(array $criteria, array $orderBy = null)
 * @method PaidExam[]    findAll()
 * @method PaidExam[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PaidExamRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PaidExam::class);
    }

    // /**
    //  * @return PaidExam[] Returns an array of PaidExam objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PaidExam
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
