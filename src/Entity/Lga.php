<?php

namespace App\Entity;

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
 *  normalizationContext={"groups"={"lga:read"}},
 *  denormalizationContext={"groups"={"lga:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"state":"exact"})
 * @ORM\Table(name="lgas")
 * @ORM\Entity(repositoryClass="App\Repository\LgaRepository")
 */
class Lga
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\State", inversedBy="lgas")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"lga:read"})
     */
    private $state;

    /**
     * @ORM\Column(type="string", length=30)
     * @Groups({"lga:read", "state:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"lga:read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"lga:read"})
     */
    private $updatedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getState(): ?State
    {
        return $this->state;
    }

    public function setState(?State $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
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

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
