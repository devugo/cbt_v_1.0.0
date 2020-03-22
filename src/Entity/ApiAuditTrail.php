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
 *  collectionOperations={
 *      "get"={
 *          "method":"GET"
 *      }
 *  },
 *  itemOperations={
 *      "get"={
 *          "method"="GET"
 *      }
 *  },
 *  normalizationContext={"groups"={"api_audit_trail:read"}},
 *  denormalizationContext={"groups"={"api_audit_trail:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"user":"exact"})
 * @ORM\Entity(repositoryClass="App\Repository\ApiAuditTrailRepository")
 */
class ApiAuditTrail
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"api_audit_trail:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $typeOfRequest;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $requestData = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $responseData = [];

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $endpoint;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="apiAuditTrails")
     * @Groups({"api_audit_trail:read", "api_audit_trail:write"})
     */
    private $user;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeOfRequest(): ?string
    {
        return $this->typeOfRequest;
    }

    public function setTypeOfRequest(?string $typeOfRequest): self
    {
        $this->typeOfRequest = $typeOfRequest;

        return $this;
    }

    public function getRequestData(): ?array
    {
        return $this->requestData;
    }

    public function setRequestData(?array $requestData): self
    {
        $this->requestData = $requestData;

        return $this;
    }

    public function getResponseData(): ?array
    {
        return $this->responseData;
    }

    public function setResponseData(?array $responseData): self
    {
        $this->responseData = $responseData;

        return $this;
    }

    public function getEndpoint(): ?string
    {
        return $this->endpoint;
    }

    public function setEndpoint(string $endpoint): self
    {
        $this->endpoint = $endpoint;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return Carbon::instance($this->getCreatedAt())->diffForHumans();
    }

     /**
    * Human Readable date; How long ago was the resource created
    * 
    * @Groups({"api_audit_trail:read"})
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
        return Carbon::instance($this->getUpdatedAt())->diffForHumans();
    }

     /**
    * Human Readable date; How long ago was the resource updated
    * 
    * @Groups({"api_audit_trail:read"})
    */
   public function getUpdatedAtAgo()
   {
       return $this->updatedAt;
   }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
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
}
