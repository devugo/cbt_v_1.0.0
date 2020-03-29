<?php

namespace App\Repository;

use App\Entity\ExamType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ExamType|null find($id, $lockMode = null, $lockVersion = null)
 * @method ExamType|null findOneBy(array $criteria, array $orderBy = null)
 * @method ExamType[]    findAll()
 * @method ExamType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExamTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ExamType::class);
    }

    // /**
    //  * @return ExamType[] Returns an array of ExamType objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ExamType
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
