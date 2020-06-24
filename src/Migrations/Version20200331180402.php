<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200331180402 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE exam_takens (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, exam_id INT DEFAULT NULL, time_spent VARCHAR(10) DEFAULT NULL, time_left VARCHAR(10) DEFAULT NULL, submitted_at DATETIME DEFAULT NULL, created_at DATETIME DEFAULT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_DE59F965A76ED395 (user_id), INDEX IDX_DE59F965578D5E91 (exam_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE exam_takens ADD CONSTRAINT FK_DE59F965A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE exam_takens ADD CONSTRAINT FK_DE59F965578D5E91 FOREIGN KEY (exam_id) REFERENCES exams (id)');
        $this->addSql('ALTER TABLE user_exam_questions ADD exam_taken_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_exam_questions ADD CONSTRAINT FK_5ECA8ED55285D3D7 FOREIGN KEY (exam_taken_id) REFERENCES exam_takens (id)');
        $this->addSql('CREATE INDEX IDX_5ECA8ED55285D3D7 ON user_exam_questions (exam_taken_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_exam_questions DROP FOREIGN KEY FK_5ECA8ED55285D3D7');
        $this->addSql('DROP TABLE exam_takens');
        $this->addSql('DROP INDEX IDX_5ECA8ED55285D3D7 ON user_exam_questions');
        $this->addSql('ALTER TABLE user_exam_questions DROP exam_taken_id');
    }
}
