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
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\SerializedName;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

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
 *      },
 *      "put"={
 *          "method"="PUT"
 *      },
 *      "patch"={
 *          "method"="PATCH"
 *      },
 *      "delete"={
 *          "method"="DELETE"
 *       }
 *  },
 *  normalizationContext={"groups"={"user:read"}},
 *  denormalizationContext={"groups"={"user:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(BooleanFilter::class, properties={"isActive", "isAdmin", "isModerator", "isTaker", "isDeleted"})
 * @UniqueEntity(fields={"email"})
 * @UniqueEntity(fields={"username"})
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100, unique=true)
     * @Assert\Length(
     *  min=10,
     *  max=100,
     *  minMessage="Email must be at least {{ limit }} characters long",
     *  maxMessage="Email cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $email;

     /**
     * @ORM\Column(type="string", length=50, unique=true)
     * @Assert\Length(
     *  min=3,
     *  max=50,
     *  minMessage="Username must be at least {{ limit }} characters long",
     *  maxMessage="Username cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     * @Groups({"user:read", "user:write"})
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string", nullable=true)
     */
    private $password;

    /**
     * @Groups({"user:write"})
     * @SerializedName("password")
     * @Assert\NotBlank
     */
    private $plainPassword = 'password';

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(
     *  min=3,
     *  max=50,
     *  minMessage="Firstname must be at least {{ limit }} characters long",
     *  maxMessage="Firstname cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(
     *  min=3,
     *  max=50,
     *  minMessage="Lastname must be at least {{ limit }} characters long",
     *  maxMessage="Lastname cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=70, nullable=true)
     * @Assert\Length(
     *  max=70,
     *  maxMessage="Othernames cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $othernames = '';

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $photo;

    /**
     * @ORM\Column(type="boolean")
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $isActive;

    /**
     * The time the user was activated or deactivated
     * 
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $isActiveActionAt;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Assert\Length(
     *  min=10,
     *  max=20,
     *  minMessage="Mobile must be at least {{ limit }} characters long",
     *  maxMessage="Mobile cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $mobile;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user:read", "user:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user:read", "user:write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url
     * @Groups({"user:read", "user:write"})
     * 
     */
    private $facebookLink;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $twitterLink;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $isAdmin;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $isModerator;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $isTaker;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"user:read", "user:write"})
     */
    private $isDeleted;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $isDeletedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Level", mappedBy="createdBy")
     */
    private $levels;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Question", mappedBy="createdBy")
     */
    private $questions;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Subject", mappedBy="createdBy")
     */
    private $subjects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Notification", mappedBy="sentBy", orphanRemoval=true)
     */
    private $sentNotifications;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Notification", mappedBy="sentTo", orphanRemoval=true)
     */
    private $receivedNotifications;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserGroup", mappedBy="createdBy")
     */
    private $createdGroups;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Exam", mappedBy="users")
     */
    private $exams;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Exam", mappedBy="createdBy")
     */
    private $examsCreated;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\AccountType", inversedBy="users")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read", "user:write"})
     */
    private $accountType;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\AccountType", mappedBy="createdBy")
     */
    private $createdAccountTypes;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ApiAuditTrail", mappedBy="user")
     */
    private $apiAuditTrails;

    /**
     * @ORM\Column(type="string", length=6, nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $sex;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $dob;

    
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->isActiveActionAt = new \DateTimeImmutable();
        $this->levels = new ArrayCollection();
        $this->questions = new ArrayCollection();
        $this->subjects = new ArrayCollection();
        $this->sentNotifications = new ArrayCollection();
        $this->receivedNotifications = new ArrayCollection();
        $this->createdGroups = new ArrayCollection();
        $this->exams = new ArrayCollection();
        $this->examsCreated = new ArrayCollection();
        $this->createdAccountTypes = new ArrayCollection();
        $this->apiAuditTrails = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(String $plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getOthernames(): ?string
    {
        return $this->othernames;
    }

    public function setOthernames(?string $othernames): self
    {
        $this->othernames = $othernames;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): self
    {
        $this->photo = $photo;

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
     * Human Readable date active or deactived ago
     * 
     * @Groups({"user:read"})
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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getMobile(): ?string
    {
        return $this->mobile;
    }

    public function setMobile(?string $mobile): self
    {
        $this->mobile = $mobile;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

     /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"user:read"})
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
     * @Groups({"user:read"})
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

    public function getFacebookLink(): ?string
    {
        return $this->facebookLink;
    }

    public function setFacebookLink(?string $facebookLink): self
    {
        $this->facebookLink = $facebookLink;

        return $this;
    }

    public function getTwitterLink(): ?string
    {
        return $this->twitterLink;
    }

    public function setTwitterLink(?string $twitterLink): self
    {
        $this->twitterLink = $twitterLink;

        return $this;
    }

    public function getIsAdmin(): ?bool
    {
        return $this->isAdmin;
    }

    public function setIsAdmin(bool $isAdmin): self
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    public function getIsModerator(): ?bool
    {
        return $this->isModerator;
    }

    public function setIsModerator(bool $isModerator): self
    {
        $this->isModerator = $isModerator;

        return $this;
    }

    public function getIsTaker(): ?bool
    {
        return $this->isTaker;
    }

    public function setIsTaker(bool $isTaker): self
    {
        $this->isTaker = $isTaker;

        return $this;
    }

    public function getIsDeleted(): ?bool
    {
        return $this->isDeleted;
    }

     /**
     * Humman readable date: How long ago was collection deleted
     * 
     * @Groups({"user:read", "user:write"})
     */
    public function getIsDeletedAgo()
    {
        return $this->isDeleted;
    }

    public function setIsDeleted(?bool $isDeleted): self
    {
        $this->isDeleted = $isDeleted;

        return $this;
    }

    public function getIsDeletedAt(): ?\DateTimeInterface
    {
        return $this->isDeletedAt;
    }

    public function setIsDeletedAt(?\DateTimeInterface $isDeletedAt): self
    {
        $this->isDeletedAt = $isDeletedAt;

        return $this;
    }

    /**
     * @return Collection|Level[]
     */
    public function getLevels(): Collection
    {
        return $this->levels;
    }

    public function addLevel(Level $level): self
    {
        if (!$this->levels->contains($level)) {
            $this->levels[] = $level;
            $level->setCreatedBy($this);
        }

        return $this;
    }

    public function removeLevel(Level $level): self
    {
        if ($this->levels->contains($level)) {
            $this->levels->removeElement($level);
            // set the owning side to null (unless already changed)
            if ($level->getCreatedBy() === $this) {
                $level->setCreatedBy(null);
            }
        }

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
            $question->setCreatedBy($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);
            // set the owning side to null (unless already changed)
            if ($question->getCreatedBy() === $this) {
                $question->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Subject[]
     */
    public function getSubjects(): Collection
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject): self
    {
        if (!$this->subjects->contains($subject)) {
            $this->subjects[] = $subject;
            $subject->setCreatedBy($this);
        }

        return $this;
    }

    public function removeSubject(Subject $subject): self
    {
        if ($this->subjects->contains($subject)) {
            $this->subjects->removeElement($subject);
            // set the owning side to null (unless already changed)
            if ($subject->getCreatedBy() === $this) {
                $subject->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Notification[]
     */
    public function getSentNotifications(): Collection
    {
        return $this->sentNotifications;
    }

    public function addSentNotification(Notification $sentNotification): self
    {
        if (!$this->sentNotifications->contains($sentNotification)) {
            $this->sentNotifications[] = $sentNotification;
            $sentNotification->setSentBy($this);
        }

        return $this;
    }

    public function removeSentNotification(Notification $sentNotification): self
    {
        if ($this->sentNotifications->contains($sentNotification)) {
            $this->sentNotifications->removeElement($sentNotification);
            // set the owning side to null (unless already changed)
            if ($sentNotification->getSentBy() === $this) {
                $sentNotification->setSentBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Notification[]
     */
    public function getReceivedNotifications(): Collection
    {
        return $this->receivedNotifications;
    }

    public function addReceivedNotification(Notification $receivedNotification): self
    {
        if (!$this->receivedNotifications->contains($receivedNotification)) {
            $this->receivedNotifications[] = $receivedNotification;
            $receivedNotification->setSentTo($this);
        }

        return $this;
    }

    public function removeReceivedNotification(Notification $receivedNotification): self
    {
        if ($this->receivedNotifications->contains($receivedNotification)) {
            $this->receivedNotifications->removeElement($receivedNotification);
            // set the owning side to null (unless already changed)
            if ($receivedNotification->getSentTo() === $this) {
                $receivedNotification->setSentTo(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|UserGroup[]
     */
    public function getCreatedGroups(): Collection
    {
        return $this->createdGroups;
    }

    public function addCreatedGroup(UserGroup $createdGroup): self
    {
        if (!$this->createdGroups->contains($createdGroup)) {
            $this->createdGroups[] = $createdGroup;
            $createdGroup->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedGroup(UserGroup $createdGroup): self
    {
        if ($this->createdGroups->contains($createdGroup)) {
            $this->createdGroups->removeElement($createdGroup);
            // set the owning side to null (unless already changed)
            if ($createdGroup->getCreatedBy() === $this) {
                $createdGroup->setCreatedBy(null);
            }
        }

        return $this;
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
            $exam->addUser($this);
        }

        return $this;
    }

    public function removeExam(Exam $exam): self
    {
        if ($this->exams->contains($exam)) {
            $this->exams->removeElement($exam);
            $exam->removeUser($this);
        }

        return $this;
    }

    /**
     * @return Collection|Exam[]
     */
    public function getExamsCreated(): Collection
    {
        return $this->examsCreated;
    }

    public function addExamsCreated(Exam $examsCreated): self
    {
        if (!$this->examsCreated->contains($examsCreated)) {
            $this->examsCreated[] = $examsCreated;
            $examsCreated->setCreatedBy($this);
        }

        return $this;
    }

    public function removeExamsCreated(Exam $examsCreated): self
    {
        if ($this->examsCreated->contains($examsCreated)) {
            $this->examsCreated->removeElement($examsCreated);
            // set the owning side to null (unless already changed)
            if ($examsCreated->getCreatedBy() === $this) {
                $examsCreated->setCreatedBy(null);
            }
        }

        return $this;
    }

    public function getAccountType(): ?AccountType
    {
        return $this->accountType;
    }

    public function setAccountType(?AccountType $accountType): self
    {
        $this->accountType = $accountType;

        return $this;
    }

    /**
     * @return Collection|AccountType[]
     */
    public function getCreatedAccountTypes(): Collection
    {
        return $this->createdAccountTypes;
    }

    public function addCreatedAccountType(AccountType $createdAccountType): self
    {
        if (!$this->createdAccountTypes->contains($createdAccountType)) {
            $this->createdAccountTypes[] = $createdAccountType;
            $createdAccountType->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedAccountType(AccountType $createdAccountType): self
    {
        if ($this->createdAccountTypes->contains($createdAccountType)) {
            $this->createdAccountTypes->removeElement($createdAccountType);
            // set the owning side to null (unless already changed)
            if ($createdAccountType->getCreatedBy() === $this) {
                $createdAccountType->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ApiAuditTrail[]
     */
    public function getApiAuditTrails(): Collection
    {
        return $this->apiAuditTrails;
    }

    public function addApiAuditTrail(ApiAuditTrail $apiAuditTrail): self
    {
        if (!$this->apiAuditTrails->contains($apiAuditTrail)) {
            $this->apiAuditTrails[] = $apiAuditTrail;
            $apiAuditTrail->setUser($this);
        }

        return $this;
    }

    public function removeApiAuditTrail(ApiAuditTrail $apiAuditTrail): self
    {
        if ($this->apiAuditTrails->contains($apiAuditTrail)) {
            $this->apiAuditTrails->removeElement($apiAuditTrail);
            // set the owning side to null (unless already changed)
            if ($apiAuditTrail->getUser() === $this) {
                $apiAuditTrail->setUser(null);
            }
        }

        return $this;
    }

    public function getSex(): ?string
    {
        return $this->sex;
    }

    public function setSex(?string $sex): self
    {
        $this->sex = $sex;

        return $this;
    }

    public function getDob(): ?string
    {
        return $this->dob;
    }

    public function setDob(?string $dob): self
    {
        $this->dob = $dob;

        return $this;
    }
}
