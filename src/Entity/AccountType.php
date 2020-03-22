<?php

namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"account_type:read"}},
 *  denormalizationContext={"groups"={"account_type:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @UniqueEntity(fields={"title"})
 * @ORM\Table(name="account_types")
 * @ORM\Entity(repositoryClass="App\Repository\AccountTypeRepository")
 */
class AccountType
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"account_type:read"})
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
     * @Groups({"account_type:read", "account_type:write", "user:read"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $description;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $usersPrivileges = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $subjectsPrivileges = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $questionsPrivileges = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $notificationsPrivileges = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $levelsPrivileges = [];

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="accountType")
     */
    private $users;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="createdAccountTypes")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $createdBy;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $accountTypesPrivileges = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $userGroupsPrivileges = [];

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
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

    public function getUsersPrivileges(): ?array
    {
        return $this->usersPrivileges;
    }

    public function setUsersPrivileges(?array $usersPrivileges): self
    {
        $this->usersPrivileges = $usersPrivileges;

        return $this;
    }

    public function getSubjectsPrivileges(): ?array
    {
        return $this->subjectsPrivileges;
    }

    public function setSubjectsPrivileges(?array $subjectsPrivileges): self
    {
        $this->subjectsPrivileges = $subjectsPrivileges;

        return $this;
    }

    public function getQuestionsPrivileges(): ?array
    {
        return $this->questionsPrivileges;
    }

    public function setQuestionsPrivileges(?array $questionsPrivileges): self
    {
        $this->questionsPrivileges = $questionsPrivileges;

        return $this;
    }

    public function getNotificationsPrivileges(): ?array
    {
        return $this->notificationsPrivileges;
    }

    public function setNotificationsPrivileges(?array $notificationsPrivileges): self
    {
        $this->notificationsPrivileges = $notificationsPrivileges;

        return $this;
    }

    public function getLevelsPrivileges(): ?array
    {
        return $this->levelsPrivileges;
    }

    public function setLevelsPrivileges(?array $levelsPrivileges): self
    {
        $this->levelsPrivileges = $levelsPrivileges;

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
            $user->setAccountType($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getAccountType() === $this) {
                $user->setAccountType(null);
            }
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
    * Human Readable date; How long ago was the resource created
    * 
    * @Groups({"account_type:read"})
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
    * @Groups({"account_type:read"})
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

    public function getAccountTypesPrivileges(): ?array
    {
        return $this->accountTypesPrivileges;
    }

    public function setAccountTypesPrivileges(?array $accountTypesPrivileges): self
    {
        $this->accountTypesPrivileges = $accountTypesPrivileges;

        return $this;
    }

    public function getUserGroupsPrivileges(): ?array
    {
        return $this->userGroupsPrivileges;
    }

    public function setUserGroupsPrivileges(?array $userGroupsPrivileges): self
    {
        $this->userGroupsPrivileges = $userGroupsPrivileges;

        return $this;
    }
}
