<?php

namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"question:read"}},
 *  denormalizationContext={"groups"={"question:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"questionType":"exact"})
 * @ORM\Table(name="questions")
 * @ORM\Entity(repositoryClass="App\Repository\QuestionRepository")
 */
class Question
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"question:read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"question:read", "question:write"})
     */
    private $createdBy;

    /**
     * @ORM\Column(type="text")
     * @Groups({"question:read", "question:write"})
     */
    private $content;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"question:read", "question:write"})
     */
    private $explanationText;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"question:read", "question:write"})
     */
    private $explanationResource;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\QuestionType", inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"question:read", "question:write"})
     */
    private $questionType;

    /**
     * @ORM\Column(type="string", length=2, nullable=true)
     * @Groups({"question:read", "question:write"})
     */
    private $noOfOptions;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"question:read", "question:write"})
     */
    private $options = [];

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Subject", inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"question:read", "question:write"})
     */
    private $subject;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Level", inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"question:read", "question:write"})
     */
    private $level;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"question:read", "question:write"})
     */
    private $correctAnswers = [];

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"question:read", "question:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"question:read", "question:write"})
     */
    private $updatedAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getExplanationText(): ?string
    {
        return $this->explanationText;
    }

    public function setExplanationText(?string $explanationText): self
    {
        $this->explanationText = $explanationText;

        return $this;
    }

    public function getExplanationResource(): ?string
    {
        return $this->explanationResource;
    }

    public function setExplanationResource(?string $explanationResource): self
    {
        $this->explanationResource = $explanationResource;

        return $this;
    }

    public function getQuestionType(): ?QuestionType
    {
        return $this->questionType;
    }

    public function setQuestionType(?QuestionType $questionType): self
    {
        $this->questionType = $questionType;

        return $this;
    }

    public function getNoOfOptions(): ?string
    {
        return $this->noOfOptions;
    }

    public function setNoOfOptions(?string $noOfOptions): self
    {
        $this->noOfOptions = $noOfOptions;

        return $this;
    }

    public function getOptions(): ?array
    {
        return $this->options;
    }

    public function setOptions(?array $options): self
    {
        $this->options = $options;

        return $this;
    }

    public function getSubject(): ?Subject
    {
        return $this->subject;
    }

    public function setSubject(?Subject $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getLevel(): ?Level
    {
        return $this->level;
    }

    public function setLevel(?Level $level): self
    {
        $this->level = $level;

        return $this;
    }

    public function getCorrectAnswers(): ?array
    {
        return $this->correctAnswers;
    }

    public function setCorrectAnswers(?array $correctAnswers): self
    {
        $this->correctAnswers = $correctAnswers;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

     /**
     * Humman readable date: How long ago was collection created
     * 
     * @Groups({"question:read", "question:write"})
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
     * Humman readable date: How long ago was collection updated
     * 
     * @Groups({"question:read", "question:write"})
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
}
