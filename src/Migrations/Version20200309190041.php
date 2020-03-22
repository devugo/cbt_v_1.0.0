<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200309190041 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE account_types ADD created_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE account_types ADD CONSTRAINT FK_6FBF5041B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_6FBF5041B03A8386 ON account_types (created_by_id)');
        $this->addSql('ALTER TABLE users ADD account_type_id INT NOT NULL');
        $this->addSql('ALTER TABLE users ADD CONSTRAINT FK_1483A5E9C6798DB FOREIGN KEY (account_type_id) REFERENCES account_types (id)');
        $this->addSql('CREATE INDEX IDX_1483A5E9C6798DB ON users (account_type_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE account_types DROP FOREIGN KEY FK_6FBF5041B03A8386');
        $this->addSql('DROP INDEX IDX_6FBF5041B03A8386 ON account_types');
        $this->addSql('ALTER TABLE account_types DROP created_by_id');
        $this->addSql('ALTER TABLE users DROP FOREIGN KEY FK_1483A5E9C6798DB');
        $this->addSql('DROP INDEX IDX_1483A5E9C6798DB ON users');
        $this->addSql('ALTER TABLE users DROP account_type_id');
    }
}
