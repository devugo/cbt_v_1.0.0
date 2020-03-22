<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

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
 *  normalizationContext={"groups"={"state:read"}},
 *  denormalizationContext={"groups"={"state:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @UniqueEntity(fields={"name"})
 * @ORM\Table(name="states")
 * @ORM\Entity(repositoryClass="App\Repository\StateRepository")
 */
class State
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=30)
     * @Groups({"state:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"state:read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"state:read"})
     */
    private $updatedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Lga", mappedBy="state", orphanRemoval=true)
     * @Groups({"state:read"})
     */
    private $lgas;

    public function __construct()
    {
        $this->lgas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection|Lga[]
     */
    public function getLgas(): Collection
    {
        return $this->lgas;
    }

    public function addLga(Lga $lga): self
    {
        if (!$this->lgas->contains($lga)) {
            $this->lgas[] = $lga;
            $lga->setState($this);
        }

        return $this;
    }

    public function removeLga(Lga $lga): self
    {
        if ($this->lgas->contains($lga)) {
            $this->lgas->removeElement($lga);
            // set the owning side to null (unless already changed)
            if ($lga->getState() === $this) {
                $lga->setState(null);
            }
        }

        return $this;
    }
}
