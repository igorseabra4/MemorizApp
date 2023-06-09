CREATE TABLE IF NOT EXISTS `USER` (
    `ID`            INT AUTO_INCREMENT PRIMARY KEY,
    `USERNAME`      VARCHAR(255) NOT NULL,
    `PASSWORD`      VARCHAR(255) NOT NULL,
    `CREATED_AT`    DATETIME NOT NULL,
    `UPDATED_AT`    DATETIME NOT NULL,

    UNIQUE (`USERNAME`)
);