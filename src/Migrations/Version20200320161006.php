<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200320161006 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE api_audit_trail (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, type_of_request VARCHAR(10) DEFAULT NULL, request_data JSON DEFAULT NULL, response_data JSON DEFAULT NULL, endpoint VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_DF546BF6A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_group (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, title VARCHAR(50) NOT NULL, cost VARCHAR(10) DEFAULT NULL, description LONGTEXT DEFAULT NULL, days_validity INT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_active TINYINT(1) NOT NULL, is_active_action_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8F02BF9D2B36786B (title), INDEX IDX_8F02BF9DB03A8386 (created_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE api_audit_trail ADD CONSTRAINT FK_DF546BF6A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE user_group ADD CONSTRAINT FK_8F02BF9DB03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('DROP TABLE api_audit_trails');
        $this->addSql('DROP TABLE user_groups');
        $this->addSql('ALTER TABLE exam_user_group ADD CONSTRAINT FK_9D0AC5C81ED93D47 FOREIGN KEY (user_group_id) REFERENCES user_group (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE exam_user_group DROP FOREIGN KEY FK_9D0AC5C81ED93D47');
        $this->addSql('CREATE TABLE api_audit_trails (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, type_of_request VARCHAR(10) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, request_data JSON DEFAULT NULL, response_data JSON DEFAULT NULL, endpoint VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_4F0FCC49A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_groups (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, title VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, cost VARCHAR(10) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, description LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, days_validity INT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_active TINYINT(1) NOT NULL, is_active_action_at DATETIME DEFAULT NULL, INDEX IDX_953F224DB03A8386 (created_by_id), UNIQUE INDEX UNIQ_953F224D2B36786B (title), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE api_audit_trails ADD CONSTRAINT FK_4F0FCC49A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE user_groups ADD CONSTRAINT FK_953F224DB03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('DROP TABLE api_audit_trail');
        $this->addSql('DROP TABLE user_group');
    }
}
