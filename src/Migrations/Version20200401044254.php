<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200401044254 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE paid_exams (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, exam_id INT DEFAULT NULL, approved_by_id INT DEFAULT NULL, cost INT DEFAULT NULL, approved_at DATETIME DEFAULT NULL, created_at DATETIME DEFAULT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_BC4DF578A76ED395 (user_id), INDEX IDX_BC4DF578578D5E91 (exam_id), INDEX IDX_BC4DF5782D234F6A (approved_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE paid_exams ADD CONSTRAINT FK_BC4DF578A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE paid_exams ADD CONSTRAINT FK_BC4DF578578D5E91 FOREIGN KEY (exam_id) REFERENCES exams (id)');
        $this->addSql('ALTER TABLE paid_exams ADD CONSTRAINT FK_BC4DF5782D234F6A FOREIGN KEY (approved_by_id) REFERENCES users (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE paid_exams');
    }
}
