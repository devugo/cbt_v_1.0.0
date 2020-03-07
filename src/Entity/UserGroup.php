<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"user_group:read"}},
 *  denormalizationContext={"groups"={"user_group:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @UniqueEntity(fields={"title"})
 * @ApiFilter(SearchFilter::class, properties={"createdBy":"exact"})
 * @ORM\Entity(repositoryClass="App\Repository\UserGroupRepository")
 */
class UserGroup
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, unique=true)
     * @Assert\Length(
     *      min = 3,
     *      max = 50,
     *      minMessage = "Title must be at least {{ limit }} characters long",
     *      maxMessage = "Title cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     * @Assert\Length(
     *      min = 1,
     *      max = 10,
     *      minMessage = "The cost must be at least {{ limit }} characters long",
     *      maxMessage = "The cost cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $cost;
    
    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $description;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $daysValidity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="createdGroups")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $createdBy;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="boolean")
     *  @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $isActive;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"user_group:read", "user_group:write"})
     */
    private $isActiveActionAt;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Exam", mappedBy="groups")
     */
    private $exams;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->exams = new ArrayCollection();
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

    public function getCost(): ?string
    {
        return $this->cost;
    }

    public function setCost(?string $cost): self
    {
        $this->cost = $cost;

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

    public function getDaysValidity(): ?int
    {
        return $this->daysValidity;
    }

    public function setDaysValidity(int $daysValidity): self
    {
        $this->daysValidity = $daysValidity;

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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
    
     /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"user_group:read"})
     */
    public function getCreatedAtAgo()
    {
        return $this->createdAt;
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
    * @Groups({"user_group:read"})
    */
   public function getUpdatedAtAgo()
   {
       return $this->updateddAt;
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

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getIsActiveActionAt(): ?\DateTimeInterface
    {
        return $this->isActiveActionAt;
    }

    public function setIsActiveActionAt(?\DateTimeInterface $isActiveActionAt): self
    {
        $this->isActiveActionAt = $isActiveActionAt;

        return $this;
    }

    /**
     * Human Readable date active or deactived ago
     * 
     * @Groups({"user_group:read"})
     */
    public function getIsActiveActionAtAgo()
    {
        return $this->isActiveActionAt;
    }

    /**
     * @return Collection|Exam[]
     */
    public function getExams(): Collection
    {
        return $this->exams;
    }

    public function addExam(Exam $exam): self
    {
        if (!$this->exams->contains($exam)) {
            $this->exams[] = $exam;
            $exam->addGroup($this);
        }

        return $this;
    }

    public function removeExam(Exam $exam): self
    {
        if ($this->exams->contains($exam)) {
            $this->exams->removeElement($exam);
            $exam->removeGroup($this);
        }

        return $this;
    }
}
