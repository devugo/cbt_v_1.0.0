<?php

namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"exam:read"}},
 *  denormalizationContext={"groups"={"exam:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(BooleanFilter::class, properties={"isActive"})
 * @UniqueEntity(fields={"title"})
 * @ApiFilter(SearchFilter::class, properties={"title":"exact", "createdBy":"exact"})
 * @ORM\Table(name="exams")
 * @ORM\Entity(repositoryClass="App\Repository\ExamRepository")
 */
class Exam
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"exam:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Assert\Length(
     *  min=3,
     *  max=100,
     *  minMessage="Title must be at least {{ limit }} characters long",
     *  maxMessage="Title cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"exam:read", "exam:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $startFrom;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $endAfter;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $duration;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $maximumAttempts;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $percentagePassMark;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $correctAnswerScore;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $wrongAnswerScore;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $allowedIpAddresses = [];

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $viewAnswersAfterSubmitting;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"exam:read", "exam:write"})
     */
    private $openQuiz;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"exam:read", "exam:write"})
     */
    private $showResultPosition;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\UserGroup", inversedBy="exams")
     * @Groups({"exam:read", "exam:write"})
     */
    private $groups;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User", inversedBy="exams")
     * @Groups({"exam:read", "exam:write"})
     */
    private $users;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="examsCreated")
     * @ORM\JoinColumn(nullable=false)
     */
    private $createdBy;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $price;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"exam:read", "exam:write"})
     */
    private $generateCertificate;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $certificateText;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"exam:read", "exam:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"exam:read", "exam:write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"exam:read", "exam:write"})
     */
    private $isActive;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $isActiveActionAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\ExamType", inversedBy="exams")
     * @Groups({"exam:read", "exam:write"})
     */
    private $examType;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $addQuestions;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $startTime;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"exam:read", "exam:write"})
     */
    private $endTime;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->isActiveActionAt = new \DateTimeImmutable();
        $this->groups = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStartFrom(): ?string
    {
        return $this->startFrom;
    }

    public function setStartFrom(?string $startFrom): self
    {
        $this->startFrom = $startFrom;

        return $this;
    }

    public function getEndAfter(): ?string
    {
        return $this->endAfter;
    }

    public function setEndAfter(?string $endAfter): self
    {
        $this->endAfter = $endAfter;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getMaximumAttempts(): ?int
    {
        return $this->maximumAttempts;
    }

    public function setMaximumAttempts(?int $maximumAttempts): self
    {
        $this->maximumAttempts = $maximumAttempts;

        return $this;
    }

    public function getPercentagePassMark(): ?int
    {
        return $this->percentagePassMark;
    }

    public function setPercentagePassMark(?int $percentagePassMark): self
    {
        $this->percentagePassMark = $percentagePassMark;

        return $this;
    }

    public function getCorrectAnswerScore(): ?int
    {
        return $this->correctAnswerScore;
    }

    public function setCorrectAnswerScore(?int $correctAnswerScore): self
    {
        $this->correctAnswerScore = $correctAnswerScore;

        return $this;
    }

    public function getWrongAnswerScore(): ?int
    {
        return $this->wrongAnswerScore;
    }

    public function setWrongAnswerScore(?int $wrongAnswerScore): self
    {
        $this->wrongAnswerScore = $wrongAnswerScore;

        return $this;
    }

    public function getAllowedIpAddresses(): ?string
    {
        return $this->allowedIpAddresses;
    }

    public function setAllowedIpAddresses(?string $allowedIpAddresses): self
    {
        $this->allowedIpAddresses = $allowedIpAddresses;

        return $this;
    }

    public function getViewAnswersAfterSubmitting(): ?bool
    {
        return $this->viewAnswersAfterSubmitting;
    }

    public function setViewAnswersAfterSubmitting(?bool $viewAnswersAfterSubmitting): self
    {
        $this->viewAnswersAfterSubmitting = $viewAnswersAfterSubmitting;

        return $this;
    }

    public function getOpenQuiz(): ?bool
    {
        return $this->openQuiz;
    }

    public function setOpenQuiz(?bool $openQuiz): self
    {
        $this->openQuiz = $openQuiz;

        return $this;
    }

    public function getShowResultPosition(): ?bool
    {
        return $this->showResultPosition;
    }

    public function setShowResultPosition(?bool $showResultPosition): self
    {
        $this->showResultPosition = $showResultPosition;

        return $this;
    }

    /**
     * @return Collection|UserGroup[]
     */
    public function getGroups(): Collection
    {
        return $this->groups;
    }

    public function addGroup(UserGroup $group): self
    {
        if (!$this->groups->contains($group)) {
            $this->groups[] = $group;
        }

        return $this;
    }

    public function removeGroup(UserGroup $group): self
    {
        if ($this->groups->contains($group)) {
            $this->groups->removeElement($group);
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
        }

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getGenerateCertificate(): ?bool
    {
        return $this->generateCertificate;
    }

    public function setGenerateCertificate(?bool $generateCertificate): self
    {
        $this->generateCertificate = $generateCertificate;

        return $this;
    }

    public function getCertificateText(): ?string
    {
        return $this->certificateText;
    }

    public function setCertificateText(?string $certificateText): self
    {
        $this->certificateText = $certificateText;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
    
     /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"exam:read"})
     */
    public function getCreatedAtAgo()
    {
        return Carbon::instance($this->getCreatedAt())->diffForHumans();
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
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
    * @Groups({"exam:read"})
    */
   public function getUpdatedAtAgo()
   {
        return Carbon::instance($this->getUpdatedAt())->diffForHumans();
   }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(?bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getIsActiveActionAt(): ?\DateTimeInterface
    {
        return $this->isActiveActionAt;
    }

     /**
     * Human Readable date active or deactived ago
     * 
     * @Groups({"exam:read"})
     */
    public function getIsActiveActionAtAgo()
    {
        return Carbon::instance($this->getIsActiveActionAt())->diffForHumans();
    }

    public function setIsActiveActionAt(?\DateTimeInterface $isActiveActionAt): self
    {
        $this->isActiveActionAt = $isActiveActionAt;

        return $this;
    }

    public function getExamType(): ?ExamType
    {
        return $this->examType;
    }

    public function setExamType(?ExamType $examType): self
    {
        $this->examType = $examType;

        return $this;
    }

    public function getAddQuestions(): ?bool
    {
        return $this->addQuestions;
    }

    public function setAddQuestions(?bool $addQuestions): self
    {
        $this->addQuestions = $addQuestions;

        return $this;
    }

    public function getStartTime(): ?string
    {
        return $this->startTime;
    }

    public function setStartTime(?string $startTime): self
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?string
    {
        return $this->endTime;
    }

    public function setEndTime(?string $endTime): self
    {
        $this->endTime = $endTime;

        return $this;
    }
}
