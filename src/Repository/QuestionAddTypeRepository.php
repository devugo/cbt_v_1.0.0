<?php

namespace App\Repository;

use App\Entity\QuestionAddType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method QuestionAddType|null find($id, $lockMode = null, $lockVersion = null)
 * @method QuestionAddType|null findOneBy(array $criteria, array $orderBy = null)
 * @method QuestionAddType[]    findAll()
 * @method QuestionAddType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QuestionAddTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuestionAddType::class);
    }

    // /**
    //  * @return QuestionAddType[] Returns an array of QuestionAddType objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('q.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?QuestionAddType
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
