<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *  collectionOperations={
 *      "get"={
 *          "method":"GET"
 *      },
 *      "post"={
 *          "method"="POST"
 *      }
 *  },
 *  itemOperations={
 *      "get"={
 *          "method"="GET"
 *      }
 *  },
 *  normalizationContext={"groups"={"question_type:read"}},
 *  denormalizationContext={"groups"={"question_type:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ORM\Table(name="question_types")
 * @ORM\Entity(repositoryClass="App\Repository\QuestionTypeRepository")
 */
class QuestionType
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"question_type:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(
     *      min = 3,
     *      max = 50,
     *      minMessage = "Your title must be at least {{ limit }} characters long",
     *      maxMessage = "Your title cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"question_type:read", "question_type:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"question_type:read", "question_type:write"})
     */
    private $description;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"question_type:read", "question_type:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"question_type:read", "question_type:write"})
     */
    private $updatedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Question", mappedBy="questionType", orphanRemoval=true)
     */
    private $questions;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserExamQuestions", mappedBy="QuestionType")
     */
    private $userExamQuestions;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->questions = new ArrayCollection();
        $this->userExamQuestions = new ArrayCollection();
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

      /**
     * Humman readable date: How long ago was collection created
     * 
     * @Groups({"question_type:read", "question_type:write"})
     */
    public function getCreatedAtAgo()
    {
        return $this->updatedAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    /**
     * Humman readable date: How long ago was collection updated
     * 
     * @Groups({"question_type:read", "question_type:write"})
     */
    public function getUpdatedAtAgo()
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection|Question[]
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions[] = $question;
            $question->setQuestionType($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);
            // set the owning side to null (unless already changed)
            if ($question->getQuestionType() === $this) {
                $question->setQuestionType(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|UserExamQuestions[]
     */
    public function getUserExamQuestions(): Collection
    {
        return $this->userExamQuestions;
    }

    public function addUserExamQuestion(UserExamQuestions $userExamQuestion): self
    {
        if (!$this->userExamQuestions->contains($userExamQuestion)) {
            $this->userExamQuestions[] = $userExamQuestion;
            $userExamQuestion->setQuestionType($this);
        }

        return $this;
    }

    public function removeUserExamQuestion(UserExamQuestions $userExamQuestion): self
    {
        if ($this->userExamQuestions->contains($userExamQuestion)) {
            $this->userExamQuestions->removeElement($userExamQuestion);
            // set the owning side to null (unless already changed)
            if ($userExamQuestion->getQuestionType() === $this) {
                $userExamQuestion->setQuestionType(null);
            }
        }

        return $this;
    }
}
