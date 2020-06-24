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
 *  @ApiResource(
 *  normalizationContext={"groups"={"user_exam_question:read"}},
 *  denormalizationContext={"groups"={"user_exam_question:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"examTaken":"exact"})
 * @ORM\Table(name="user_exam_questions")
 * @ORM\Entity(repositoryClass="App\Repository\UserExamQuestionsRepository")
 */
class UserExamQuestions
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_exam_question:read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="userExamQuestions")
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Question", inversedBy="userExamQuestions")
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $question;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Exam", inversedBy="userExamQuestions")
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $exam;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\QuestionType", inversedBy="userExamQuestions")
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $QuestionType;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $content;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $explanationText;

    /**
     * @ORM\Column(type="string", length=2, nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $noOfOptions;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $options = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $correctAnswers = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $chosenAnswers = [];

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\ExamTaken", inversedBy="userExamQuestion")
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $examTaken;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $image;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user_exam_question:read", "user_exam_question:write"})
     */
    private $explanationResource;

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

    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    public function setQuestion(?Question $question): self
    {
        $this->question = $question;

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

    public function getQuestionType(): ?QuestionType
    {
        return $this->QuestionType;
    }

    public function setQuestionType(?QuestionType $QuestionType): self
    {
        $this->QuestionType = $QuestionType;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
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

    public function getCorrectAnswers(): ?array
    {
        return $this->correctAnswers;
    }

    public function setCorrectAnswers(?array $correctAnswers): self
    {
        $this->correctAnswers = $correctAnswers;

        return $this;
    }

    public function getChosenAnswers(): ?array
    {
        return $this->chosenAnswers;
    }

    public function setChosenAnswers(?array $chosenAnswers): self
    {
        $this->chosenAnswers = $chosenAnswers;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
    
    /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"user_exam_question:read"})
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
     * @Groups({"user_exam_question:read"})
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

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

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
}
