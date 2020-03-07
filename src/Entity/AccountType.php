<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

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
     * @Groups({"account_type:read", "account_type:write"})
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
    private $notificatioPrivileges = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"account_type:read", "account_type:write"})
     */
    private $levelsPrivileges = [];

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

    public function getNotificatioPrivileges(): ?array
    {
        return $this->notificatioPrivileges;
    }

    public function setNotificatioPrivileges(?array $notificatioPrivileges): self
    {
        $this->notificatioPrivileges = $notificatioPrivileges;

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
}
