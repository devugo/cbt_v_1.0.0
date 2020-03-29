<?php

namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"notification:read"}},
 *  denormalizationContext={"groups"={"notification:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ORM\Table(name="notifications")
 * @ORM\Entity(repositoryClass="App\Repository\NotificationRepository")
 */
class Notification
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"notification:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(
     *  min=2,
     *  max=255,
     *  minMessage="Title must be at least {{ limit }} characters long",
     *  maxMessage="Title cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"notification:read", "notification:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     * @Groups({"notification:read", "notification:write"})
     */
    private $message;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url
     * @Groups({"notification:read", "notification:write"})
     */
    private $actionLink;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="sentNotifications")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"notification:read", "notification:write"})
     */
    private $sentBy;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="receivedNotifications")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"notification:read", "notification:write"})
     */
    private $sentTo;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"notification:read", "notification:write"})
     */
    private $seenAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"notification:read", "notification:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"notification:read", "notification:write"})
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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getActionLink(): ?string
    {
        return $this->actionLink;
    }

    public function setActionLink(?string $actionLink): self
    {
        $this->actionLink = $actionLink;

        return $this;
    }

    public function getSentBy(): ?User
    {
        return $this->sentBy;
    }

    public function setSentBy(?User $sentBy): self
    {
        $this->sentBy = $sentBy;

        return $this;
    }

    public function getSentTo(): ?User
    {
        return $this->sentTo;
    }

    public function setSentTo(?User $sentTo): self
    {
        $this->sentTo = $sentTo;

        return $this;
    }

    public function getSeenAt(): ?\DateTimeInterface
    {
        return $this->seenAt;
    }

    public function setSeenAt(?\DateTimeInterface $seenAt): self
    {
        $this->seenAt = $seenAt;

        return $this;
    }

      /**
     * Human Readable date; How long ago was the resource seen by the receiver
     * 
     * @Groups({"notification:read"})
     */
    public function getSeenAtAgo()
    {
        return $this->seenAt ? Carbon::instance($this->getSeenAt())->diffForHumans() : '';
    }


    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * Human Readable date; How long ago was the resource created
     * 
     * @Groups({"notification:read"})
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
     * @Groups({"notification:read"})
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
