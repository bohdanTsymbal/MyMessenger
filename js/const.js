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
const REGEXP_TAG = /<[^<>]+>/g;
const REGEXP_SPECIAL = /\\n|\\0|\\r|\\b|\\t|\\v|\\f/g;

const REGISTRATION_CHECKS_PHP = ['http://localhost/Projects/MyMessenger/php/registrationChecks.php', 'http://195.64.154.3/php/registrationChecks.php'];
const LOG_IN_PHP = ['http://localhost/Projects/MyMessenger/php/logIn.php', 'http://195.64.154.3/php/logIn.php'];
const RESTORE_PASSWORD_PHP = ['http://localhost/Projects/MyMessenger/php/restorePassword.php', 'http://195.64.154.3/php/restorePassword.php'];
const SET_NEW_PASSWORD_PHP = ['http://localhost/Projects/MyMessenger/php/setNewPassword.php', 'http://195.64.154.3/php/setNewPassword.php'];
const GET_ALL_USERS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllUsers.php', 'http://195.64.154.3/php/getAllUsers.php'];
const GET_ALL_CHATS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllChats.php', 'http://195.64.154.3/php/getAllChats.php'];
const GET_FULL_NAME_PHP = ['http://localhost/Projects/MyMessenger/php/getFullName.php', 'http://195.64.154.3/php/getFullName.php'];
const GET_MESSAGES_PHP = ['http://localhost/Projects/MyMessenger/php/getMessages.php', 'http://195.64.154.3/php/getMessages.php'];
const CHECK_SESSION_PHP = ['http://localhost/Projects/MyMessenger/php/checkSession.php', 'http://195.64.154.3/php/checkSession.php'];
const CONFIRM_REGISTRATION_PHP = ['http://localhost/Projects/MyMessenger/php/confirmRegistration.php', 'http://195.64.154.3/php/confirmRegistration.php'];
const CONFIRM_RECOVERY_PHP = ['http://localhost/Projects/MyMessenger/php/confirmRecovery.php', 'http://195.64.154.3/php/confirmRecovery.php'];
const GET_USER_INFO_PHP = ['http://localhost/Projects/MyMessenger/php/getUserInfo.php', 'http://195.64.154.3/php/getUserInfo.php'];
const GET_DATE_PHP = ['http://localhost/Projects/MyMessenger/php/getDate.php', 'http://195.64.154.3/php/getDate.php'];
const GET_TASKS_PHP = ['http://localhost/Projects/MyMessenger/php/getTasks.php', 'http://195.64.154.3/php/getTasks.php'];
const IP = ['127.0.0.1', '195.64.154.3'];