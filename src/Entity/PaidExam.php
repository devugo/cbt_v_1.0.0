<?php

namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"paid_exam:read"}},
 *  denormalizationContext={"groups"={"paid_exam:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ORM\Table(name="paid_exams")
 * @ORM\Entity(repositoryClass="App\Repository\PaidExamRepository")
 */
class PaidExam
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"paid_exam:read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="paidExams")
     * @Groups({"paid_exam:read", "paid_exam:write", "exam:read", "user:read"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Exam", inversedBy="paidExams")
     * @Groups({"paid_exam:read", "paid_exam:write", "exam:read", "user:read"})
     */
    private $exam;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"paid_exam:read", "paid_exam:write", "exam:read", "user:read"})
     */
    private $cost;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="approvedPaidExams")
     * @Groups({"paid_exam:read", "paid_exam:write", "exam:read", "user:read"})
     */
    private $approvedBy;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"paid_exam:read", "paid_exam:write", "exam:read", "user:read"})
     */
    private $approvedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"paid_exam:read", "paid_exam:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"paid_exam:read", "paid_exam:write"})
     */
    private $updatedAt;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\ExamTaken", mappedBy="paidExam", cascade={"persist", "remove"})
     * @Groups({"paid_exam:read", "paid_exam:write"})
     */
    private $examTaken;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getExam(): ?Exam
    {
        return $this->exam;
    }

    public function setExam(?Exam $exam): self
    {
        $this->exam = $exam;

        return $this;
    }

    public function getCost(): ?int
    {
        return $this->cost;
    }

    public function setCost(?int $cost): self
    {
        $this->cost = $cost;

        return $this;
    }

    public function getApprovedBy(): ?User
    {
        return $this->approvedBy;
    }

    public function setApprovedBy(?User $approvedBy): self
    {
        $this->approvedBy = $approvedBy;

        return $this;
    }

    public function getApprovedAt(): ?\DateTimeInterface
    {
        return $this->approvedAt;
    }

     /**
     * Human Readable date; How long ago was the resource approved
     * 
     * @Groups({"paid_exam:read"})
     */
    public function getApprovedAtAgo()
    {
        return $this->approvedAt ? Carbon::instance($this->getApprovedAt())->diffForHumans() : NULL;
    }

    public function setApprovedAt(?\DateTimeInterface $approvedAt): self
    {
        $this->approvedAt = $approvedAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
    
     /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"paid_exam:read"})
     */
    public function getCreatedAtAgo()
    {
        return Carbon::instance($this->getCreatedAt())->diffForHumans();
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }
    
     /**
     * Human Readable date; How long ago was the resource updated
     * 
     * @Groups({"paid_exam:read"})
     */
    public function getUpdatedAtAgo()
    {
        return Carbon::instance($this->getUpdatedAt())->diffForHumans();
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getExamTaken(): ?ExamTaken
    {
        return $this->examTaken;
    }

    public function setExamTaken(?ExamTaken $examTaken): self
    {
        $this->examTaken = $examTaken;

        // set (or unset) the owning side of the relation if necessary
        $newPaidExam = null === $examTaken ? null : $this;
        if ($examTaken->getPaidExam() !== $newPaidExam) {
            $examTaken->setPaidExam($newPaidExam);
        }

        return $this;
    }
}
