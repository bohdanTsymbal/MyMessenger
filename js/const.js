'use strict';

const SIGN_IN_PAGE = '#signin';
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

const REGISTRATION_CHECKS_PHP = ['http://localhost/Projects/MyMessenger/php/registrationChecks.php', 'https://mymessengerbackend.000webhostapp.com/php/registrationChecks.php'];
const LOG_IN_PHP = ['http://localhost/Projects/MyMessenger/php/logIn.php', 'https://mymessengerbackend.000webhostapp.com/php/logIn.php'];
const RESTORE_PASSWORD_PHP = ['http://localhost/Projects/MyMessenger/php/restorePassword.php', 'https://mymessengerbackend.000webhostapp.com/php/restorePassword.php'];
const SET_NEW_PASSWORD_PHP = ['http://localhost/Projects/MyMessenger/php/setNewPassword.php', 'https://mymessengerbackend.000webhostapp.com/php/setNewPassword.php'];
const GET_ALL_USERS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllUsers.php', 'https://mymessengerbackend.000webhostapp.com/php/getAllUsers.php'];
const GET_ALL_CHATS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllChats.php', 'https://mymessengerbackend.000webhostapp.com/php/getAllChats.php'];
const GET_FULL_NAME_PHP = ['http://localhost/Projects/MyMessenger/php/getFullName.php', 'https://mymessengerbackend.000webhostapp.com/php/getFullName.php'];
const GET_MESSAGES_PHP = ['http://localhost/Projects/MyMessenger/php/getMessages.php', 'https://mymessengerbackend.000webhostapp.com/php/getMessages.php'];
const CHECK_SESSION_PHP = ['http://localhost/Projects/MyMessenger/php/checkSession.php', 'https://mymessengerbackend.000webhostapp.com/php/checkSession.php'];
const CONFIRM_REGISTRATION_PHP = ['http://localhost/Projects/MyMessenger/php/confirmRegistration.php', 'https://mymessengerbackend.000webhostapp.com/php/confirmRegistration.php'];
const CONFIRM_RECOVERY_PHP = ['http://localhost/Projects/MyMessenger/php/confirmRecovery.php', 'https://mymessengerbackend.000webhostapp.com/php/confirmRecovery.php'];
const GET_USER_INFO_PHP = ['http://localhost/Projects/MyMessenger/php/getUserInfo.php', 'https://mymessengerbackend.000webhostapp.com/php/getUserInfo.php'];