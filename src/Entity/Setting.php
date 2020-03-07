<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"setting:read"}},
 *  denormalizationContext={"groups"={"setting:write"}},
 *  attributes={
 *      "pagination_items_per_page"=10
 *  }
 * )
 * @ORM\Table(name="settings")
 * @ORM\Entity(repositoryClass="App\Repository\SettingRepository")
 */
class Setting
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *  min=3,
     *  max=255,
     *  minMessage="App name must be at least {{ limit }} characters long",
     *  maxMessage="App name cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $appName;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Assert\Length(
     *  min=3,
     *  max=100,
     *  minMessage="App title must be at least {{ limit }} characters long",
     *  maxMessage="App title cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $appTitle;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $enableUserRegistration;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $enableOpenExam;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $EnableShareButtons;

    /**
     * @ORM\Column(type="string", length=150, nullable=true)
     * @Assert\Length(
     *  min=6,
     *  max=150,
     *  minMessage="Default password must be at least {{ limit }} characters long",
     *  maxMessage="Default password cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $defaultPassword;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $advertDisplayAfterPageLoads;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $advertDisplayDuration;

    /**
     * @ORM\Column(type="string", length=150, nullable=true)
     *  @Assert\Length(
     *  min=6,
     *  max=150,
     *  minMessage="Email SMTP host name must be at least {{ limit }} characters long",
     *  maxMessage="Email SMTP host name password cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $emailSmtpHostname;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     *  @Assert\Length(
     *  min=6,
     *  max=100,
     *  minMessage="Email SMTP Username must be at least {{ limit }} characters long",
     *  maxMessage="Email SMTP Username cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $emailSmtpUsername;

    /**
     * @ORM\Column(type="string", length=100)
     *  @Assert\Length(
     *  min=5,
     *  max=100,
     *  minMessage="Email SMTP password must be at least {{ limit }} characters long",
     *  maxMessage="Email SMTP password cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $emailSmtpPassword;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     *  @Assert\Length(
     *  min=2,
     *  max=10,
     *  minMessage="Email SMTP port must be at least {{ limit }} characters long",
     *  maxMessage="Email SMTP port cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $emailSmtpPort;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $verifyUserEmail;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     *  @Assert\Length(
     *  min=2,
     *  max=20,
     *  minMessage="Email protocol must be at least {{ limit }} characters long",
     *  maxMessage="Email protocol cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $emailProtocol;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     *  @Assert\Length(
     *  min=2,
     *  max=50,
     *  minMessage="SMTP Email Type must be at least {{ limit }} characters long",
     *  maxMessage="SMTP Email Type cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $smtpMailType;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(
     *  min=3,
     *  max=255,
     *  minMessage="Activation email subject must be at least {{ limit }} characters long",
     *  maxMessage="Activation email subject cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $activationEmailSubject;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *  min=7,
     *  max=255,
     *  minMessage="Activation Email Link must be at least {{ limit }} characters long",
     *  maxMessage="SMTP Activation Email link Type cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $activationEmailLink;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $activationEmailMessage;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *  min=4,
     *  max=255,
     *  minMessage="Password change email subject must be at least {{ limit }} characters long",
     *  maxMessage="Password change email subject Type cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $passwordChangeEmailSubject;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $passwordChangeEmailMessage;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *  min=4,
     *  max=255,
     *  minMessage="Password change email link must be at least {{ limit }} characters long",
     *  maxMessage="Password change email link Type cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $passwordChangeEmailLink;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(
     *  type="bool",
     *  message="The value {{ value  }} is not a valid {{ type }}"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $enableMailResult;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *  min=4,
     *  max=255,
     *  minMessage="Result email subject must be at least {{ limit }} characters long",
     *  maxMessage="Result email subject Type cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $resultEmailSubject;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"setting:read", "setting:write"})
     */
    private $resultEmailMessage;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *  min=4,
     *  max=255,
     *  minMessage="Result email link must be at least {{ limit }} characters long",
     *  maxMessage="Result email link Type cannot be longer than {{ limit }} characters"
     * )
     * @Groups({"setting:read", "setting:write"})
     */
    private $resultEmailLink;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAppName(): ?string
    {
        return $this->appName;
    }

    public function setAppName(?string $appName): self
    {
        $this->appName = $appName;

        return $this;
    }

    public function getAppTitle(): ?string
    {
        return $this->appTitle;
    }

    public function setAppTitle(?string $appTitle): self
    {
        $this->appTitle = $appTitle;

        return $this;
    }

    public function getEnableUserRegistration(): ?bool
    {
        return $this->enableUserRegistration;
    }

    public function setEnableUserRegistration(?bool $enableUserRegistration): self
    {
        $this->enableUserRegistration = $enableUserRegistration;

        return $this;
    }

    public function getEnableOpenExam(): ?bool
    {
        return $this->enableOpenExam;
    }

    public function setEnableOpenExam(?bool $enableOpenExam): self
    {
        $this->enableOpenExam = $enableOpenExam;

        return $this;
    }

    public function getEnableShareButtons(): ?bool
    {
        return $this->EnableShareButtons;
    }

    public function setEnableShareButtons(?bool $EnableShareButtons): self
    {
        $this->EnableShareButtons = $EnableShareButtons;

        return $this;
    }

    public function getDefaultPassword(): ?string
    {
        return $this->defaultPassword;
    }

    public function setDefaultPassword(?string $defaultPassword): self
    {
        $this->defaultPassword = $defaultPassword;

        return $this;
    }

    public function getAdvertDisplayAfterPageLoads(): ?int
    {
        return $this->advertDisplayAfterPageLoads;
    }

    public function setAdvertDisplayAfterPageLoads(?int $advertDisplayAfterPageLoads): self
    {
        $this->advertDisplayAfterPageLoads = $advertDisplayAfterPageLoads;

        return $this;
    }

    public function getAdvertDisplayDuration(): ?int
    {
        return $this->advertDisplayDuration;
    }

    public function setAdvertDisplayDuration(?int $advertDisplayDuration): self
    {
        $this->advertDisplayDuration = $advertDisplayDuration;

        return $this;
    }

    public function getEmailSmtpHostname(): ?string
    {
        return $this->emailSmtpHostname;
    }

    public function setEmailSmtpHostname(?string $emailSmtpHostname): self
    {
        $this->emailSmtpHostname = $emailSmtpHostname;

        return $this;
    }

    public function getEmailSmtpUsername(): ?string
    {
        return $this->emailSmtpUsername;
    }

    public function setEmailSmtpUsername(?string $emailSmtpUsername): self
    {
        $this->emailSmtpUsername = $emailSmtpUsername;

        return $this;
    }

    public function getEmailSmtpPassword(): ?string
    {
        return $this->emailSmtpPassword;
    }

    public function setEmailSmtpPassword(string $emailSmtpPassword): self
    {
        $this->emailSmtpPassword = $emailSmtpPassword;

        return $this;
    }

    public function getEmailSmtpPort(): ?string
    {
        return $this->emailSmtpPort;
    }

    public function setEmailSmtpPort(?string $emailSmtpPort): self
    {
        $this->emailSmtpPort = $emailSmtpPort;

        return $this;
    }

    public function getVerifyUserEmail(): ?bool
    {
        return $this->verifyUserEmail;
    }

    public function setVerifyUserEmail(?bool $verifyUserEmail): self
    {
        $this->verifyUserEmail = $verifyUserEmail;

        return $this;
    }

    public function getEmailProtocol(): ?string
    {
        return $this->emailProtocol;
    }

    public function setEmailProtocol(?string $emailProtocol): self
    {
        $this->emailProtocol = $emailProtocol;

        return $this;
    }

    public function getSmtpMailType(): ?string
    {
        return $this->smtpMailType;
    }

    public function setSmtpMailType(?string $smtpMailType): self
    {
        $this->smtpMailType = $smtpMailType;

        return $this;
    }

    public function getActivationEmailSubject(): ?string
    {
        return $this->activationEmailSubject;
    }

    public function setActivationEmailSubject(string $activationEmailSubject): self
    {
        $this->activationEmailSubject = $activationEmailSubject;

        return $this;
    }

    public function getActivationEmailLink(): ?string
    {
        return $this->activationEmailLink;
    }

    public function setActivationEmailLink(?string $activationEmailLink): self
    {
        $this->activationEmailLink = $activationEmailLink;

        return $this;
    }

    public function getActivationEmailMessage(): ?string
    {
        return $this->activationEmailMessage;
    }

    public function setActivationEmailMessage(?string $activationEmailMessage): self
    {
        $this->activationEmailMessage = $activationEmailMessage;

        return $this;
    }

    public function getPasswordChangeEmailSubject(): ?string
    {
        return $this->passwordChangeEmailSubject;
    }

    public function setPasswordChangeEmailSubject(?string $passwordChangeEmailSubject): self
    {
        $this->passwordChangeEmailSubject = $passwordChangeEmailSubject;

        return $this;
    }

    public function getPasswordChangeEmailMessage(): ?string
    {
        return $this->passwordChangeEmailMessage;
    }

    public function setPasswordChangeEmailMessage(?string $passwordChangeEmailMessage): self
    {
        $this->passwordChangeEmailMessage = $passwordChangeEmailMessage;

        return $this;
    }

    public function getPasswordChangeEmailLink(): ?string
    {
        return $this->passwordChangeEmailLink;
    }

    public function setPasswordChangeEmailLink(?string $passwordChangeEmailLink): self
    {
        $this->passwordChangeEmailLink = $passwordChangeEmailLink;

        return $this;
    }

    public function getEnableMailResult(): ?bool
    {
        return $this->enableMailResult;
    }

    public function setEnableMailResult(?bool $enableMailResult): self
    {
        $this->enableMailResult = $enableMailResult;

        return $this;
    }

    public function getResultEmailSubject(): ?string
    {
        return $this->resultEmailSubject;
    }

    public function setResultEmailSubject(?string $resultEmailSubject): self
    {
        $this->resultEmailSubject = $resultEmailSubject;

        return $this;
    }

    public function getResultEmailMessage(): ?string
    {
        return $this->resultEmailMessage;
    }

    public function setResultEmailMessage(?string $resultEmailMessage): self
    {
        $this->resultEmailMessage = $resultEmailMessage;

        return $this;
    }

    public function getResultEmailLink(): ?string
    {
        return $this->resultEmailLink;
    }

    public function setResultEmailLink(?string $resultEmailLink): self
    {
        $this->resultEmailLink = $resultEmailLink;

        return $this;
    }
}
