<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"difficulty_level:read"}},
 *  denormalizationContext={"groups"={"difficulty_level:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @UniqueEntity(fields={"title"})
 * @ApiFilter(SearchFilter::class, properties={"title":"exact"})
 * @ORM\Entity(repositoryClass="App\Repository\DifficultyLevelRepository")
 */
class DifficultyLevel
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
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
     * @Groups({"difficulty_level:read", "difficulty_level:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"difficulty_level:read", "difficulty_level:write"})
     */
    private $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
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

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
