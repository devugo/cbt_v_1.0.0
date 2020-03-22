<?php

namespace App\Repository;

use App\Entity\ApiAuditTrail;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ApiAuditTrail|null find($id, $lockMode = null, $lockVersion = null)
 * @method ApiAuditTrail|null findOneBy(array $criteria, array $orderBy = null)
 * @method ApiAuditTrail[]    findAll()
 * @method ApiAuditTrail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ApiAuditTrailRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ApiAuditTrail::class);
    }

    // /**
    //  * @return ApiAuditTrail[] Returns an array of ApiAuditTrail objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ApiAuditTrail
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
