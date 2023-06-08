CREATE TABLE IF NOT EXISTS `CARD` (
    `ID`                INT AUTO_INCREMENT PRIMARY KEY,
    `ID_COLLECTION`     INT NOT NULL,
    `ID_LESSON`         INT NOT NULL,
    `ID_CARD_TYPE`      VARCHAR(3) NOT NULL,
    `CARD`              JSON NOT NULL,
    `ORDER`             INT NOT NULL,
    `CREATED_AT`        DATETIME NOT NULL,
    `UPDATED_AT`        DATETIME NOT NULL,
    `ID_CARD_STATUS`    VARCHAR(1) NOT NULL,
    `LAST_SEEN_AT`      DATETIME NULL,
    `DUE_AT`            DATETIME NULL,
    `LAST_INTERVAL`     INT NULL,
    `EASINESS_FACTOR`   DOUBLE NULL,

    FOREIGN KEY (`ID_COLLECTION`)   REFERENCES `COLLECTION`(`ID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`ID_LESSON`)       REFERENCES `LESSON`(`ID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`ID_CARD_TYPE`)    REFERENCES `CARD_TYPE`(`ID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`ID_CARD_STATUS`)  REFERENCES `CARD_STATUS`(`ID`)
        ON UPDATE CASCADE ON DELETE CASCADE
);