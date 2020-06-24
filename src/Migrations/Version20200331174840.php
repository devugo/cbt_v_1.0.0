<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200331174840 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_exam_questions (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, question_id INT DEFAULT NULL, exam_id INT DEFAULT NULL, question_type_id INT DEFAULT NULL, content LONGTEXT DEFAULT NULL, explanation_text LONGTEXT DEFAULT NULL, no_of_options VARCHAR(2) DEFAULT NULL, options JSON DEFAULT NULL, correct_answers JSON DEFAULT NULL, chosen_answers JSON DEFAULT NULL, created_at DATETIME DEFAULT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_5ECA8ED5A76ED395 (user_id), INDEX IDX_5ECA8ED51E27F6BF (question_id), INDEX IDX_5ECA8ED5578D5E91 (exam_id), INDEX IDX_5ECA8ED5CB90598E (question_type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_exam_questions ADD CONSTRAINT FK_5ECA8ED5A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE user_exam_questions ADD CONSTRAINT FK_5ECA8ED51E27F6BF FOREIGN KEY (question_id) REFERENCES questions (id)');
        $this->addSql('ALTER TABLE user_exam_questions ADD CONSTRAINT FK_5ECA8ED5578D5E91 FOREIGN KEY (exam_id) REFERENCES exams (id)');
        $this->addSql('ALTER TABLE user_exam_questions ADD CONSTRAINT FK_5ECA8ED5CB90598E FOREIGN KEY (question_type_id) REFERENCES question_types (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE user_exam_questions');
    }
}
