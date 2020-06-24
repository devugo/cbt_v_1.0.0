<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200401063833 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE exam_takens ADD paid_exam_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE exam_takens ADD CONSTRAINT FK_DE59F965A45F91F4 FOREIGN KEY (paid_exam_id) REFERENCES paid_exams (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_DE59F965A45F91F4 ON exam_takens (paid_exam_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE exam_takens DROP FOREIGN KEY FK_DE59F965A45F91F4');
        $this->addSql('DROP INDEX UNIQ_DE59F965A45F91F4 ON exam_takens');
        $this->addSql('ALTER TABLE exam_takens DROP paid_exam_id');
    }
}
