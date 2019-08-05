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

const CHECK_PHP = ['http://localhost/Projects/MyMessenger/php/check.php', 'https://mymessengerbackend.000webhostapp.com/php/check.php'];
const AUTHORIZATION_PHP = ['http://localhost/Projects/MyMessenger/php/authorization.php', 'https://mymessengerbackend.000webhostapp.com/php/authorization.php'];
const RECOVERY_PHP = ['http://localhost/Projects/MyMessenger/php/recovery.php', 'https://mymessengerbackend.000webhostapp.com/php/recovery.php'];
const NEW_PASSWORD_PHP = ['http://localhost/Projects/MyMessenger/php/newPassword.php', 'https://mymessengerbackend.000webhostapp.com/php/newPassword.php'];
const GET_ALL_USERS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllUsers.php', 'https://mymessengerbackend.000webhostapp.com/php/getAllUsers.php'];
const GET_ALL_CHATS_PHP = ['http://localhost/Projects/MyMessenger/php/getAllChats.php', 'https://mymessengerbackend.000webhostapp.com/php/getAllChats.php'];
const GET_FULL_NAME_PHP = ['http://localhost/Projects/MyMessenger/php/getFullName.php', 'https://mymessengerbackend.000webhostapp.com/php/getFullName.php'];
const GET_MESSAGES_PHP = ['http://localhost/Projects/MyMessenger/php/getMessages.php', 'https://mymessengerbackend.000webhostapp.com/php/getMessages.php'];
const CHECK_REGISTRATION_SESSION_PHP = ['http://localhost/Projects/MyMessenger/php/checkRegistrationSession.php', 'https://mymessengerbackend.000webhostapp.com/php/checkRegistrationSession.php'];
const CONFIRM_REGISTRATION_PHP = ['http://localhost/Projects/MyMessenger/php/confirmRegistration.php', 'https://mymessengerbackend.000webhostapp.com/php/confirmRegistration.php'];
const CONFIRM_RECOVERY_PHP = ['http://localhost/Projects/MyMessenger/php/confirmRecovery.php', 'https://mymessengerbackend.000webhostapp.com/php/confirmRecovery.php'];
const CHECK_RECOVERY_SESSION_PHP = ['http://localhost/Projects/MyMessenger/php/checkRecoverySession.php', 'https://mymessengerbackend.000webhostapp.com/php/checkRecoverySession.php'];
const CHECK_NEW_PASSWORD_SESSION_PHP = ['http://localhost/Projects/MyMessenger/php/checkNewPasswordSession.php', 'https://mymessengerbackend.000webhostapp.com/php/checkNewPasswordSession.php'];
const CHECK_AUTHORIZATION_PHP = ['http://localhost/Projects/MyMessenger/php/checkAuthorization.php', 'https://mymessengerbackend.000webhostapp.com/php/checkAuthorization.php'];
const RETURN_USER_INFO_PHP = ['http://localhost/Projects/MyMessenger/php/returnUserInfo.php', 'https://mymessengerbackend.000webhostapp.com/php/returnUserInfo.php'];
const SEND_MESSAGE_PHP = ['http://localhost/Projects/MyMessenger/php/sendMessage.php', 'https://mymessengerbackend.000webhostapp.com/php/sendMessage.php'];