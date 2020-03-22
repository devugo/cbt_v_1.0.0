<?php

namespace App\Repository;

use App\Entity\Lga;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Lga|null find($id, $lockMode = null, $lockVersion = null)
 * @method Lga|null findOneBy(array $criteria, array $orderBy = null)
 * @method Lga[]    findAll()
 * @method Lga[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LgaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lga::class);
    }

    // /**
    //  * @return Lga[] Returns an array of Lga objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('l.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Lga
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
