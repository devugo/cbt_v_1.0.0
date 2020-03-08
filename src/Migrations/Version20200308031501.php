<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200308031501 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE account_types (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, users_privileges JSON DEFAULT NULL, subjects_privileges JSON DEFAULT NULL, questions_privileges JSON DEFAULT NULL, notificatio_privileges JSON DEFAULT NULL, levels_privileges JSON DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE exams (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, title VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, start_from DATETIME DEFAULT NULL, end_after DATETIME DEFAULT NULL, duration INT DEFAULT NULL, maximum_attempts INT DEFAULT NULL, percentage_pass_mark INT DEFAULT NULL, correct_answer_score INT DEFAULT NULL, wrong_answer_score INT DEFAULT NULL, allowed_ip_addresses JSON DEFAULT NULL, view_answers_after_submitting TINYINT(1) DEFAULT NULL, open_quiz TINYINT(1) DEFAULT NULL, show_result_position TINYINT(1) DEFAULT NULL, add_questions VARCHAR(255) DEFAULT NULL, price INT DEFAULT NULL, generate_certificate TINYINT(1) DEFAULT NULL, certificate_text LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_active TINYINT(1) DEFAULT NULL, is_active_action_at DATETIME DEFAULT NULL, INDEX IDX_69311328B03A8386 (created_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE exam_user_group (exam_id INT NOT NULL, user_group_id INT NOT NULL, INDEX IDX_9D0AC5C8578D5E91 (exam_id), INDEX IDX_9D0AC5C81ED93D47 (user_group_id), PRIMARY KEY(exam_id, user_group_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE exam_user (exam_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_7750FA578D5E91 (exam_id), INDEX IDX_7750FAA76ED395 (user_id), PRIMARY KEY(exam_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE levels (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, title VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_9F2A64192B36786B (title), INDEX IDX_9F2A6419B03A8386 (created_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notifications (id INT AUTO_INCREMENT NOT NULL, sent_by_id INT NOT NULL, sent_to_id INT NOT NULL, title VARCHAR(255) NOT NULL, message LONGTEXT NOT NULL, action_link VARCHAR(255) DEFAULT NULL, seen_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_6000B0D3A45BB98C (sent_by_id), INDEX IDX_6000B0D33E89D3ED (sent_to_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE questions (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, question_type_id INT NOT NULL, subject_id INT NOT NULL, level_id INT NOT NULL, content LONGTEXT NOT NULL, explanation_text LONGTEXT DEFAULT NULL, explanation_resource VARCHAR(255) DEFAULT NULL, no_of_options VARCHAR(2) DEFAULT NULL, options JSON DEFAULT NULL, correct_answers JSON DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_8ADC54D5B03A8386 (created_by_id), INDEX IDX_8ADC54D5CB90598E (question_type_id), INDEX IDX_8ADC54D523EDC87 (subject_id), INDEX IDX_8ADC54D55FB14BA7 (level_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE question_add_types (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_ED56C76A2B36786B (title), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE question_types (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(50) NOT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE settings (id INT AUTO_INCREMENT NOT NULL, app_name VARCHAR(255) DEFAULT NULL, app_title VARCHAR(100) DEFAULT NULL, enable_user_registration TINYINT(1) DEFAULT NULL, enable_open_exam TINYINT(1) DEFAULT NULL, enable_share_buttons TINYINT(1) DEFAULT NULL, default_password VARCHAR(150) DEFAULT NULL, advert_display_after_page_loads INT DEFAULT NULL, advert_display_duration INT DEFAULT NULL, email_smtp_hostname VARCHAR(150) DEFAULT NULL, email_smtp_username VARCHAR(100) DEFAULT NULL, email_smtp_password VARCHAR(100) NOT NULL, email_smtp_port VARCHAR(10) DEFAULT NULL, verify_user_email TINYINT(1) DEFAULT NULL, email_protocol VARCHAR(20) DEFAULT NULL, smtp_mail_type VARCHAR(50) DEFAULT NULL, activation_email_subject VARCHAR(255) NOT NULL, activation_email_link VARCHAR(255) DEFAULT NULL, activation_email_message LONGTEXT DEFAULT NULL, password_change_email_subject VARCHAR(255) DEFAULT NULL, password_change_email_message LONGTEXT DEFAULT NULL, password_change_email_link VARCHAR(255) DEFAULT NULL, enable_mail_result TINYINT(1) DEFAULT NULL, result_email_subject VARCHAR(255) DEFAULT NULL, result_email_message LONGTEXT DEFAULT NULL, result_email_link VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subjects (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, title VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, is_active TINYINT(1) NOT NULL, is_active_action_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_AB2599172B36786B (title), INDEX IDX_AB259917B03A8386 (created_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(100) NOT NULL, username VARCHAR(50) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) DEFAULT NULL, firstname VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, othernames VARCHAR(70) DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, is_active TINYINT(1) NOT NULL, is_active_action_at DATETIME DEFAULT NULL, address LONGTEXT DEFAULT NULL, mobile VARCHAR(20) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, facebook_link VARCHAR(255) DEFAULT NULL, twitter_link VARCHAR(255) DEFAULT NULL, is_admin TINYINT(1) NOT NULL, is_moderator TINYINT(1) NOT NULL, is_taker TINYINT(1) NOT NULL, is_deleted TINYINT(1) DEFAULT NULL, is_deleted_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), UNIQUE INDEX UNIQ_1483A5E9F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_group (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, title VARCHAR(50) NOT NULL, cost VARCHAR(10) DEFAULT NULL, description LONGTEXT DEFAULT NULL, days_validity INT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_active TINYINT(1) NOT NULL, is_active_action_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8F02BF9D2B36786B (title), INDEX IDX_8F02BF9DB03A8386 (created_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE exams ADD CONSTRAINT FK_69311328B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE exam_user_group ADD CONSTRAINT FK_9D0AC5C8578D5E91 FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE exam_user_group ADD CONSTRAINT FK_9D0AC5C81ED93D47 FOREIGN KEY (user_group_id) REFERENCES user_group (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE exam_user ADD CONSTRAINT FK_7750FA578D5E91 FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE exam_user ADD CONSTRAINT FK_7750FAA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE levels ADD CONSTRAINT FK_9F2A6419B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D3A45BB98C FOREIGN KEY (sent_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D33E89D3ED FOREIGN KEY (sent_to_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE questions ADD CONSTRAINT FK_8ADC54D5B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE questions ADD CONSTRAINT FK_8ADC54D5CB90598E FOREIGN KEY (question_type_id) REFERENCES question_types (id)');
        $this->addSql('ALTER TABLE questions ADD CONSTRAINT FK_8ADC54D523EDC87 FOREIGN KEY (subject_id) REFERENCES subjects (id)');
        $this->addSql('ALTER TABLE questions ADD CONSTRAINT FK_8ADC54D55FB14BA7 FOREIGN KEY (level_id) REFERENCES levels (id)');
        $this->addSql('ALTER TABLE subjects ADD CONSTRAINT FK_AB259917B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE user_group ADD CONSTRAINT FK_8F02BF9DB03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE exam_user_group DROP FOREIGN KEY FK_9D0AC5C8578D5E91');
        $this->addSql('ALTER TABLE exam_user DROP FOREIGN KEY FK_7750FA578D5E91');
        $this->addSql('ALTER TABLE questions DROP FOREIGN KEY FK_8ADC54D55FB14BA7');
        $this->addSql('ALTER TABLE questions DROP FOREIGN KEY FK_8ADC54D5CB90598E');
        $this->addSql('ALTER TABLE questions DROP FOREIGN KEY FK_8ADC54D523EDC87');
        $this->addSql('ALTER TABLE exams DROP FOREIGN KEY FK_69311328B03A8386');
        $this->addSql('ALTER TABLE exam_user DROP FOREIGN KEY FK_7750FAA76ED395');
        $this->addSql('ALTER TABLE levels DROP FOREIGN KEY FK_9F2A6419B03A8386');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D3A45BB98C');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D33E89D3ED');
        $this->addSql('ALTER TABLE questions DROP FOREIGN KEY FK_8ADC54D5B03A8386');
        $this->addSql('ALTER TABLE subjects DROP FOREIGN KEY FK_AB259917B03A8386');
        $this->addSql('ALTER TABLE user_group DROP FOREIGN KEY FK_8F02BF9DB03A8386');
        $this->addSql('ALTER TABLE exam_user_group DROP FOREIGN KEY FK_9D0AC5C81ED93D47');
        $this->addSql('DROP TABLE account_types');
        $this->addSql('DROP TABLE exams');
        $this->addSql('DROP TABLE exam_user_group');
        $this->addSql('DROP TABLE exam_user');
        $this->addSql('DROP TABLE levels');
        $this->addSql('DROP TABLE notifications');
        $this->addSql('DROP TABLE questions');
        $this->addSql('DROP TABLE question_add_types');
        $this->addSql('DROP TABLE question_types');
        $this->addSql('DROP TABLE settings');
        $this->addSql('DROP TABLE subjects');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE user_group');
    }
}
