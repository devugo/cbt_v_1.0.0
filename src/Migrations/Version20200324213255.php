<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200324213255 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE exams ADD exam_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE exams ADD CONSTRAINT FK_69311328C8EAD5FB FOREIGN KEY (exam_type_id) REFERENCES exam_types (id)');
        $this->addSql('CREATE INDEX IDX_69311328C8EAD5FB ON exams (exam_type_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE exams DROP FOREIGN KEY FK_69311328C8EAD5FB');
        $this->addSql('DROP INDEX IDX_69311328C8EAD5FB ON exams');
        $this->addSql('ALTER TABLE exams DROP exam_type_id');
    }
}
