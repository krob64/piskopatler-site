#!/bin/bash

# Function to prompt for MySQL root password
read -s -p "Enter MySQL root password: " rootpasswd
echo

# Function to prompt for piskouser password
read -s -p "Enter password for new MySQL user 'piskouser': " piskouserpasswd
echo

# Command to create a new MySQL user named piskouser
mysql -u root -p"$rootpasswd" -e "CREATE USER 'piskouser'@'localhost' IDENTIFIED BY '$piskouserpasswd';"

# Command to create a new database named pisko_db
mysql -u root -p"$rootpasswd" -e "CREATE DATABASE pisko_db;"

# Command to grant all privileges to piskouser on pisko_db
mysql -u root -p"$rootpasswd" -e "GRANT ALL PRIVILEGES ON pisko_db.* TO 'piskouser'@'localhost';"
mysql -u root -p"$rootpasswd" -e "FLUSH PRIVILEGES;"

# Command to create the table named users
mysql -u piskouser -p"$piskouserpasswd" pisko_db -e "
CREATE TABLE users (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered` date NOT NULL,
  PRIMARY KEY (`id`)
);"
mysql -u piskouser -p"$piskouserpasswd" pisko_db -e "
INSERT INTO users (username, password, registered) VALUES ("testuser", "$2a$10$54hkeCIkH3pAb5dVVMFFG.IsgKAL1kFuVduDEbCJyQzpIX.FfS3h", now());
"

# Command to create the table named wallofshame
mysql -u piskouser -p"$piskouserpasswd" pisko_db -e "
CREATE TABLE wallofshame (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `message` varchar(255) NOT NULL,
  `steamlink` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
);"
mysql -u piskouser -p"$piskouserpasswd" pisko_db -e "
INSERT INTO wallofshame (name, message, steamlink, date) VALUES ("● some_player", ": totally appropriate message", "https://steamcommunity.com/profiles/76561198061739893", now());
INSERT INTO wallofshame (name, message, steamlink, date) VALUES ("● anotherPLAYER", ": incredibly valuable message", "https://steamcommunity.com/profiles/76561198061739894", now());
INSERT INTO wallofshame (name, message, steamlink, date) VALUES ("● user234234", ": A successor to the programming language B, C was originally developed at Bell Labs by Ritchie between 1972 and 1973 to construct utilities running on Unix. It was applied to re-implementing the kernel of the Unix operating system.", "https://steamcommunity.com/profiles/76561198061739896", now());
"

# Command to create the table named invitecodes
mysql -u piskouser -p"$piskouserpasswd" pisko_db -e "
CREATE TABLE invitecodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);"

# Command to create the table named quakerolls
mysql -u piskouser -p"$piskouserpasswd" pisko_db -e "
CREATE TABLE quakerolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    roll VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);"

echo "All tasks completed successfully."
