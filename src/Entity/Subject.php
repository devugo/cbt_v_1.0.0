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
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"subject:read"}},
 *  denormalizationContext={"groups"={"subject:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(BooleanFilter::class, properties={"isActive"})
 * @UniqueEntity(fields={"title"})
 * @ORM\Table(name="subjects")
 * @ORM\Entity(repositoryClass="App\Repository\SubjectRepository")
 */
class Subject
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"subject:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100, unique=true)
     * @Assert\Length(
     *      min = 3,
     *      max = 100,
     *      minMessage = "Your title must be at least {{ limit }} characters long",
     *      maxMessage = "Your title cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"subject:read", "subject:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"subject:read", "subject:write"})
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="subjects")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"subject:read", "subject:write"})
     */
    private $createdBy;

    /**
     * @ORM\Column(type="boolean")
     *  @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"subject:read", "subject:write"})
     */
    private $isActive;

    /**
     * The time the subject was activated or deactivated
     * 
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"subject:read", "subject:write"})
     */
    private $isActiveActionAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"subject:read", "subject:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"subject:read", "subject:write"})
     */
    private $updatedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Question", mappedBy="subject", orphanRemoval=true)
     */
    private $questions;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->isActiveActionAt = new \DateTimeImmutable();
        $this->questions = new ArrayCollection();
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

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getIsActiveActionAt(): ?\DateTimeInterface
    {
        return $this->isActiveActionAt;
    }
    
    /**
     * Human Readable date active or deactivated ago
     * 
     * @Groups({"subject:read"})
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"subject:read"})
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
     * @Groups({"subject:read"})
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
            $question->setSubject($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);
            // set the owning side to null (unless already changed)
            if ($question->getSubject() === $this) {
                $question->setSubject(null);
            }
        }

        return $this;
    }
}
