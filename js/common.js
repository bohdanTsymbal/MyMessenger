'use strict';

let errors, response, id;

errors = true;

window.onhashchange = () => navigate(location.hash);
// window.onload = removeWebhostAd;

makePostRequest(CHECK_AUTHORIZATION_PHP[0], '', () => {
    if (response) {
        location.hash = CHATS_PAGE;
        navigate(CHATS_PAGE);
        displayChatsPage();
    }
    else {
        location.hash = SIGN_IN_PAGE;
        navigate(SIGN_IN_PAGE);        
    }
});

function navigate(hash) {
    switch (hash) {
        case REGISTARTION_PAGE: {
            displayPage('main .registrationPage');
            
            let firstNameInput = document.querySelector('main .registrationPage .registrationForm #firstName');
            let lastNameInput = document.querySelector('main .registrationPage .registrationForm #lastName');
            let emailInput = document.querySelector('main .registrationPage .registrationForm #email');
            let usernameInput = document.querySelector('main .registrationPage .registrationForm .username');
            let password1Input = document.querySelector('main .registrationPage .registrationForm .password1');
            let password2Input = document.querySelector('main .registrationPage .registrationForm .password2');
            let selector = 'main .registrationPage .serverResponse';

            firstNameInput.oninput = () => checkInput.call(firstNameInput, REGEXP_NAME);
            lastNameInput.oninput = () => checkInput.call(lastNameInput, REGEXP_NAME);
            emailInput.oninput = () => checkInput.call(emailInput, REGEXP_EMAIL);
            usernameInput.oninput = () => checkInput.call(usernameInput, REGEXP_USERNAME);
            password1Input.oninput = () => checkInput.call(password1Input, REGEXP_PASSWORD);
            password2Input.oninput = () => checkPasswordCompliance(password1Input, password2Input);
            
            let button = document.querySelector('main .registrationPage .registrationForm #toRegistrationVerificationPage');
            button.onclick = () => checkEmptiness(selector, () => {
                let firstName = firstNameInput.value.trim();
                let lastName = lastNameInput.value.trim();
                let email = emailInput.value.trim();
                let username = usernameInput.value.trim();
                let password = password2Input.value.trim();
                let params = `firstName=${firstName}&lastName=${lastName}&email=${email}&username=${username}&password=${password}`;

                makePostRequest(CHECK_PHP[0], params, () => processPreliminaryResponse(selector, REGISTRATION_VERIFICATION_PAGE));
            }, firstNameInput, lastNameInput, emailInput, usernameInput, password1Input, password2Input);
            break;
        }

        case SIGN_IN_PAGE: {
            displayPage();

            let usernameLogInInput = document.querySelector('main .startPage .signInForm .username');
            let passwordLogInInput = document.querySelector('main .startPage .signInForm #password');
            let button = document.querySelector('main .startPage .signInForm #signIn');
            let selector = 'main .startPage .serverResponse';

            button.onclick = () => checkEmptiness(selector, () => logIn(usernameLogInInput.value.trim(), passwordLogInInput.value.trim()), usernameLogInInput, passwordLogInInput);
            break;
        }

        case REGISTRATION_VERIFICATION_PAGE: {
            makePostRequest(CHECK_REGISTRATION_SESSION_PHP[0], '', () => {
                if (response) {
                    displayPage('main .registrationVerificationPage');

                    let input = document.querySelector('main .registrationVerificationPage .registrationVerificationForm .verificationCode');
                    let button = document.querySelector('main .registrationVerificationPage .registrationVerificationForm .confirm');
                    let selector = 'main .registrationVerificationPage .serverResponse';

                    button.onclick = () => checkEmptiness(selector, () => {
                        let userInput = input.value.trim();
                        let params = `userInput=${userInput}`;
                        let selector = 'main .startPage .serverResponse';

                        makePostRequest(CONFIRM_REGISTRATION_PHP[0], params, () => processFinalResponse(() => {
                            location.hash = SIGN_IN_PAGE;
                            alert('Registration has been successful!');
                        }, selector));
                    }, input);
                }
                else {
                    location.hash = SIGN_IN_PAGE;
                }
            });
            break;
        }

        case RECOVERY_PAGE: {
            displayPage('main .recoveryPage');

            let input = document.querySelector('main .recoveryPage .recoveryForm .username');
            let button = document.querySelector('main .recoveryPage .recoveryForm #toVerificationPage');
            let selector = 'main .recoveryPage .serverResponse';

            button.onclick = () => checkEmptiness(selector, () => {
                let username = input.value.trim();
                let params = `username=${username}`;
                let selector = 'main .recoveryPage .serverResponse';

                makePostRequest(RECOVERY_PHP[0], params, () => processPreliminaryResponse(selector, RECOVERY_VERIFICATION_PAGE));
            }, input);
            break;
        }

        case RECOVERY_VERIFICATION_PAGE: {
            makePostRequest(CHECK_RECOVERY_SESSION_PHP[0], '', () => {
                if (response) {
                    displayPage('main .recoveryVerificationPage');

                    let input = document.querySelector('main .recoveryVerificationPage .recoveryVerificationForm .verificationCode');
                    let button = document.querySelector('main .recoveryVerificationPage .recoveryVerificationForm .confirm');
                    let selector = 'main .recoveryVerificationPage .serverResponse';
                    
                    button.onclick = () => checkEmptiness(selector, () => {
                        let userInput = input.value.trim();
                        let params = `userInput=${userInput}`;

                        makePostRequest(CONFIRM_RECOVERY_PHP[0], params, () => processPreliminaryResponse(selector, NEW_PASSWORD_PAGE));
                    }, input);
                }
                else {
                    location.hash = SIGN_IN_PAGE;
                }
            });
            break;
        }

        case NEW_PASSWORD_PAGE: {
            makePostRequest(CHECK_NEW_PASSWORD_SESSION_PHP[0], '', () => {
                if (response) {
                    displayPage('main .newPasswordPage');

                    let password1Input = document.querySelector('main .newPasswordPage .newPasswordForm .password1');
                    let password2Input = document.querySelector('main .newPasswordPage .newPasswordForm .password2');
                    let button = document.querySelector('main .newPasswordPage .newPasswordForm .confirm');
                    let selector = 'main .newPasswordPage .serverResponse';

                    password1Input.oninput = () => checkInput.call(password1Input, REGEXP_PASSWORD);
                    password2Input.oninput = () => checkPasswordCompliance(password1Input, password2Input);

                    button.onclick = () => checkEmptiness(selector, () => {
                        let newPassword = password2Input.value.trim();
                        let params = `newPassword=${newPassword}`;
                        let selector = 'main .newPasswordPage .serverResponse';
                        let message = 'Your password has been changed succefully!';

                        makePostRequest(NEW_PASSWORD_PHP[0], params, () => processFinalResponse(() => {
                            location.hash = SIGN_IN_PAGE;
                            alert(message);
                        }, selector));
                    }, password1Input, password2Input);
                }
                else {
                    location.hash = SIGN_IN_PAGE;
                }
            });
            break;
        }

        case CHATS_PAGE: {
            makePostRequest(CHECK_AUTHORIZATION_PHP[0], '', () => {
                if (response) {
                    displayPage('main .chatsPage', 'flex');
            
                    document.querySelector('main').className = 'nullPadding';
                    document.querySelector('main .chatsPage .sidebar #tc2').style.display = 'none';
                    
                    let allTabs = document.querySelectorAll('main .chatsPage .sidebar .tabs .tab');
                    let allContent = document.querySelectorAll('main .chatsPage .sidebar .tabContent');  
        
                    document.querySelector('main .chatsPage .sidebar .tabs').onclick = () => switchTab(event, allTabs, allContent, 'activeTab', 'main .chatsPage .sidebar #tc', 'block');
        
                    document.querySelector('main .chatsPage .sidebar .tabs #t2').onclick = () => {
                        let content = document.querySelector('main .chatsPage .sidebar #tc2 .user');  
                        
                        if (!content) {
                            makePostRequest(GET_ALL_USERS_PHP[0], '', displayAllUsers);
                        }
                    }


                }
                else {
                    location.hash = SIGN_IN_PAGE;
                }
            });
            break;
        }

        default: {
            break;
        }
    }
}

function displayPage(elementSelector=null, displayType='block') {
    let pages = document.querySelectorAll('main *');
    let startPage = 'main .startPage';

    for (let i = 0; i < pages.length; i++) {
        pages[i].removeAttribute('style');
    }

    if (elementSelector) {
        document.querySelector(startPage).style.display = 'none';
        document.querySelector(elementSelector).style.display = displayType;
    }
}

function checkEmptiness(outSelector, perform, ...elements) {
    let condition = true;
    let out = document.querySelector(outSelector);

    for (let i = 0; i < elements.length; i++) {
        if (!elements[i].value.trim()) {
            condition = false;
            break;
        }
    }

    if (condition) {
        perform();
    }
    else {
        out.innerHTML = 'All fields must be filled!';
        out.style.opacity = '1';
    }
}

function checkInput(pattern) {
    if (!pattern.test(this.value.trim())) {
        this.style.borderBottom = '2px solid red';
        errors = true;
    }
    else {
        this.removeAttribute('style');
        errors = false;
    }
}

function checkPasswordCompliance(firstElement, secondElement) {
    if (firstElement.value.trim() != secondElement.value.trim() || !REGEXP_PASSWORD.test(secondElement.value.trim())) {
        firstElement.style.borderBottom = '2px solid red';
        secondElement.style.borderBottom = '2px solid red';
        errors = true;
    }
    else {
        firstElement.removeAttribute('style');
        secondElement.removeAttribute('style');
        errors = false;
    }
}

function clearInputs() {
    let inputs = document.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}

function removeWebhostAd() {
    let elements = document.querySelectorAll('div');
    elements[elements.length - 1].style.display = "none";
}

function makePostRequest(url, params, perform) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    xhr.onreadystatechange = function() {
        if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            response = this.responseText;
            perform();
        }
    }
}

function processPreliminaryResponse(outSelector, toPage) {
    let out = document.querySelector(outSelector);

    if (response == true) {
        location.hash = toPage;
    }
    else {
        out.innerHTML = response;
        out.style.opacity = '1';
    }
}

function processFinalResponse(perform, outSelector) {
    let out = document.querySelector(outSelector);

    if (response == true) {
        clearInputs();
        out.removeAttribute('style');
        perform();
    }
    else {
        out.innerHTML = response;
        out.style.opacity = '1';
    }
}

function logIn(username, password) {
    let params = `username=${username}&password=${password}`;
    let selector = 'main .startPage .serverResponse';

    makePostRequest(AUTHORIZATION_PHP[0], params, () => processFinalResponse(displayChatsPage, selector));
}

function displayChatsPage() {
    location.hash = CHATS_PAGE;

    makePostRequest(RETURN_USER_INFO_PHP[0], 'requestedInfo=id', () => {
        if (response) {
            id = response;
            connect();
            makePostRequest(GET_ALL_CHATS_PHP[0], '', displayAllChats);
        }
        else {
            alert('No!');
        }
    });
}

function switchTab(event, allTabs, allContent, className, contentSelector, displayType=null) {
    let rightTarget = false;

    for (let i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove(className);
        allContent[i].style.display = 'none';

        if (allTabs[i] == event.target) {
            rightTarget = true;
        }
    }

    rightTarget = rightTarget ? event.target : event.target.parentNode;
    let id = Number(((rightTarget.id).match(/\d/g)).join(''));

    rightTarget.classList.add(className);

    if (displayType) {
        document.querySelector(`${contentSelector}${id}`).style.display = displayType;
    }
}

function createChatInterface(interlocutorId, firstName, lastName, number=null) {
    let chatsPage = document.querySelector('main .chatsPage');
    let chatUI = document.createElement('div');
    let interlocutorInfo = document.createElement('div');
    let messages = document.createElement('div');
    let userForm = document.createElement('div');
    let userInput = document.createElement('input');
    let send = document.createElement('button');

    chatUI.className = 'activeChatInterface';
    chatUI.id = `i${interlocutorId}`;
    interlocutorInfo.className = 'interlocutorInfo';
    interlocutorInfo.innerHTML = `${firstName} ${lastName}`;
    messages.className = 'messages';
    userForm.className = 'userForm';
    userInput.id = 'userInput';
    userInput.type = 'text';
    userInput.autocomplete = 'off';
    userInput.placeholder = 'Type a message';
    send.id = 'send';
    send.type = 'button';
    send.innerHTML = 'Send';

    send.onclick = () => {
        let userInput = document.querySelector(`main .chatsPage #i${interlocutorId} .userForm #userInput`);
        let message = userInput.value.trim();
        if (message !== '') {
            sendMessage(interlocutorId, message, messages);
            userInput.value = '';
        }
    }

    window.onkeydown = (event) => {
        if (event.code === 'Enter') {
            let userInput = document.querySelector(`main .chatsPage #i${interlocutorId} .userForm #userInput`);
            let message = userInput.value.trim();
            if (message !== '') {
                sendMessage(interlocutorId, message, messages);
                userInput.value = '';
            }
        }
    }

    if (number) {
        let params = `interlocutorId=${interlocutorId}&number=${number}`;

        makePostRequest(GET_MESSAGES_PHP[0], params, () => {
            let messagesContent = JSON.parse(response);

            for (let i = messagesContent.length - 1; i > -1; i--) {
                let message = document.createElement('div');
                
                message.className = messagesContent[i].fromUser == id ? 'userMessage' : 'interlocutorMessage';
                message.innerHTML = messagesContent[i].message;

                messages.appendChild(message);
                messages.scrollTo(0, messages.scrollHeight);
            }
        });
    }

    chatsPage.appendChild(chatUI);
    chatUI.appendChild(interlocutorInfo);
    chatUI.appendChild(messages);
    chatUI.appendChild(userForm);
    userForm.appendChild(userInput);
    userForm.appendChild(send);
}

function displayAllUsers() {
    let users = JSON.parse(response);
    let usersList = document.querySelector('main .chatsPage .sidebar #tc2');

    for (let i = 0; i < users.length; i++) {
        let user = document.createElement('div');
        let userName = document.createElement('h3');
        let chatButton = document.createElement('button');
        let firstName = users[i].firstName;
        let lastName = users[i].lastName;
        let userId = users[i].id;
        let sidebarChat = document.querySelector(`main .chatsPage .sidebar .tabContent #u${userId}`);
        let sidebarChats = document.querySelectorAll('main .chatsPage .sidebar .tabContent .chat');

        user.className = 'user';
        chatButton.className = 'toChat';
        chatButton.innerHTML = 'Chat';
        userName.innerHTML = `${firstName} ${lastName}`;
        chatButton.onclick = () => {
            let chat = document.querySelector(`main .chatsPage #i${userId}`);
            let chats = document.querySelectorAll('main .chatsPage .activeChatInterface');

            clearActive(chats, sidebarChats);

            if (!chat) {
                let sidebarChat = document.querySelector(`main .chatsPage .sidebar .tabContent #u${userId}`);

                createChatInterface(userId, firstName, lastName, 50);
                chat = document.querySelector(`main .chatsPage #i${userId}`);
                chat.style.display = 'flex';

                if (sidebarChat) {
                    sidebarChat.classList.add('activeChat');
                }
            }
            else if (sidebarChat) {
                chat.style.display = 'flex';
                sidebarChat.classList.add('activeChat');
            }
            else {
                chat.style.display = 'flex';
            }
        };

        usersList.appendChild(user);
        user.appendChild(userName);
        user.appendChild(chatButton);
    }
}

function displayAllChats() {
    let messages = JSON.parse(response);
    let displayedChats = [];
    let chatsList = document.querySelector('main .chatsPage .sidebar #tc1');

    for (let i = messages.length - 1; i > -1; i--) {
        let interlocutorId = messages[i].fromUser == id ? messages[i].toUser : messages[i].fromUser;

        if (displayedChats.indexOf(interlocutorId) == -1) {
            let params = `id=${interlocutorId}`;

            displayedChats.push(interlocutorId);

            makePostRequest(GET_FULL_NAME_PHP[0], params, () => {
                let chat = document.createElement('div');
                let lastMessage = document.createElement('p');
                let name = document.createElement('h3');
                let fullName = JSON.parse(response);

                name.className = 'name';
                name.innerHTML = `${fullName.firstName} ${fullName.lastName}`;
                chat.className = 'chat';
                chat.id = `u${interlocutorId}`;
                lastMessage.className = 'lastMessage';
                lastMessage.innerHTML = messages[i].message;

                chat.appendChild(name);
                chat.appendChild(lastMessage);
                chatsList.appendChild(chat);
                
                chat.onclick = () => {
                    let chatInterface = document.querySelector(`main .chatsPage #i${interlocutorId}`);

                    if (!chatInterface) {
                        createChatInterface(interlocutorId, fullName.firstName, fullName.lastName, 50);
                        chatInterface = document.querySelector(`main .chatsPage #i${interlocutorId}`);
                    }

                    let sidebarChats = document.querySelectorAll('main .chatsPage .sidebar .tabContent .chat');
                    let chats = document.querySelectorAll('main .chatsPage .activeChatInterface');

                    clearActive(chats, sidebarChats);

                    chat.classList.add('activeChat');
                    chatInterface.style.display = 'flex';
                }
            });
        }
    }
}

function clearActive(chats, sidebarChats) {
    for (let i = 0; i < chats.length; i++) {
        chats[i].style.display = 'none';
    }

    for (let i = 0; i < sidebarChats.length; i++) {
        sidebarChats[i].classList.remove('activeChat');
    }
}

function connect() {
    makePostRequest(CHECK_AUTHORIZATION_PHP[0], '', () => {
        if (response) {
            let WebSocketConnection = new WebSocket(`ws://127.0.0.1:8000/?userId=${id}`);

            WebSocketConnection.onmessage = (event) => {
                let data = JSON.parse(event.data);
                let fromUser = data.fromUser;
                let message = data.message;
        
                let chat = document.querySelector(`main .chatsPage #i${fromUser} .messages`);
        
                let newMessage = document.createElement('div');
        
                newMessage.className = 'interlocutorMessage';
                newMessage.innerHTML = message;
        
                chat.appendChild(newMessage);
                chat.scrollTo(0, chat.scrollHeight);
            };
        }
        else {
            alert('No!');
        }
    });
}

function sendMessage(interlocutorId, message, chat) {
    let params = `interlocutorId=${interlocutorId}&message=${message}`;

    makePostRequest(SEND_MESSAGE_PHP[0], params, () => {
        if(response) {
            let messageBlock = document.createElement('div');

            messageBlock.className = 'userMessage';
            messageBlock.innerHTML = message;

            chat.appendChild(messageBlock);
            chat.scrollTo(0, chat.scrollHeight);
        }
    });
}   