<?php

namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"exam_taken:read"}},
 *  denormalizationContext={"groups"={"exam_taken:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ORM\Table(name="exam_takens")
 * * @ApiFilter(SearchFilter::class, properties={"exam":"exact", "user":"exact"})
 * @ORM\Entity(repositoryClass="App\Repository\ExamTakenRepository")
 */
class ExamTaken
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"exam_taken:read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="examTakens")
     * @Groups({"exam_taken:read", "exam_taken:write", "exam:read"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Exam", inversedBy="examTakens")
     * @Groups({"exam_taken:read", "exam_taken:write", "exam:read", "user:read"})
     */
    private $exam;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     * @Groups({"exam_taken:read", "exam_taken:write", "exam:read"})
     */
    private $timeSpent;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     * @Groups({"exam_taken:read", "exam_taken:write", "exam:read"})
     */
    private $timeLeft;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"exam_taken:read", "exam_taken:write", "exam:read"})
     */
    private $submittedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"exam_taken:read", "exam_taken:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"exam_taken:read", "exam_taken:write"})
     */
    private $updatedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserExamQuestions", mappedBy="examTaken")
     * @Groups({"exam_taken:read"})
     */
    private $userExamQuestion;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\PaidExam", inversedBy="examTaken", cascade={"persist", "remove"})
     * @Groups({"exam_taken:read", "exam_taken:write"})
     */
    private $paidExam;

    public function __construct()
    {
        $this->userExamQuestion = new ArrayCollection();
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

    public function getTimeSpent(): ?string
    {
        return $this->timeSpent;
    }

    public function setTimeSpent(?string $timeSpent): self
    {
        $this->timeSpent = $timeSpent;

        return $this;
    }

    public function getTimeLeft(): ?string
    {
        return $this->timeLeft;
    }

    public function setTimeLeft(?string $timeLeft): self
    {
        $this->timeLeft = $timeLeft;

        return $this;
    }

    public function getSubmittedAt(): ?\DateTimeInterface
    {
        return $this->submittedAt;
    }

     /**
     * Human Readable date; How long ago was the resource submitted
     * 
     * @Groups({"exam_taken:read"})
     */
    public function getSubmittedAtAgo()
    {
        return $this->getSubmittedAt() ? Carbon::instance($this->getSubmittedAt())->diffForHumans() : '';
    }

    public function setSubmittedAt(?\DateTimeInterface $submittedAt): self
    {
        $this->submittedAt = $submittedAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

     /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"exam_taken:read"})
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
     * @Groups({"exam_taken:read"})
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

    /**
     * @return Collection|UserExamQuestions[]
     */
    public function getUserExamQuestion(): Collection
    {
        return $this->userExamQuestion;
    }

    public function addUserExamQuestion(UserExamQuestions $userExamQuestion): self
    {
        if (!$this->userExamQuestion->contains($userExamQuestion)) {
            $this->userExamQuestion[] = $userExamQuestion;
            $userExamQuestion->setExamTaken($this);
        }

        return $this;
    }

    public function removeUserExamQuestion(UserExamQuestions $userExamQuestion): self
    {
        if ($this->userExamQuestion->contains($userExamQuestion)) {
            $this->userExamQuestion->removeElement($userExamQuestion);
            // set the owning side to null (unless already changed)
            if ($userExamQuestion->getExamTaken() === $this) {
                $userExamQuestion->setExamTaken(null);
            }
        }

        return $this;
    }

    public function getPaidExam(): ?PaidExam
    {
        return $this->paidExam;
    }

    public function setPaidExam(?PaidExam $paidExam): self
    {
        $this->paidExam = $paidExam;

        return $this;
    }
}
