'use strict';

const SIGNIN_PAGE = '#signin';
const REGISTARTION_PAGE = '#registration';
const REGISTRATION_VERIFICATION_PAGE = '#registration_verification';
const RECOVERY_PAGE = '#recovery';
const RECOVERY_VERIFICATION_PAGE = '#recovery_verification';
const NEW_PASSWORD_PAGE = '#new_password';
const CHATS_PAGE = '#chats';

const REGEXP_NAME = /(^[A-Za-zА-Яа-яЁё]+$)/;
const REGEXP_EMAIL = /(^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$)/;
const REGEXP_USERNAME = /(^([a-zA-Z0-9_-\~\!\@\#\$\%\^\&\*\(\)\+\=\`\"\;\[\]\{\}\:\|\<\>\,\.\-]){5,}$)/;
const REGEXP_PASSWORD = /(^[a-zA-Z0-9_-]{8,}$)/;

const CHECK_PHP = ['http://localhost/Projects/MyMessenger/php/check.php', 'https://mymessengerbackend.000webhostapp.com/php/check.php'];
const REGISTRATION_PHP = ['http://localhost/Projects/MyMessenger/php/registration.php', 'https://mymessengerbackend.000webhostapp.com/php/registration.php'];
const AUTHORIZATION_PHP = ['http://localhost/Projects/MyMessanger/php/authorization.php', 'https://mymessengerbackend.000webhostapp.com/php/authorization.php'];
const RECOVERY_PHP = ['http://localhost/Projects/MyMessanger/php/recovery.php', 'https://mymessengerbackend.000webhostapp.com/php/recovery.php'];
const NEW_PASSWORD_PHP = ['http://localhost/Projects/MyMessanger/php/newPassword.php', 'https://mymessengerbackend.000webhostapp.com/php/newPassword.php'];
const GET_ALL_USERS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllUsers.php', 'https://mymessengerbackend.000webhostapp.com/php/getAllUsers.php'];
const GET_ALL_CHATS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllChats.php', 'https://mymessengerbackend.000webhostapp.com/php/getAllChats.php'];
const GET_FULL_NAME_PHP = ['http://localhost/Projects/MyMessenger/php/getFullName.php', 'https://mymessengerbackend.000webhostapp.com/php/getFullName.php'];
const GET_MESSAGES_PHP = ['http://localhost/Projects/MyMessenger/php/getMessages.php', 'https://mymessengerbackend.000webhostapp.com/php/getMessages.php'];