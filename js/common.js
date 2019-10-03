'use strict';

let errors, response, id, inId, token, WebSocketConnection, sHeight;

errors = true;

window.onhashchange = () => navigate(location.hash);

const params = 'param=id&unset=0';
makePostRequest(CHECK_SESSION_PHP[0], params, () => {
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
            
            const firstNameInput = document.querySelector('main .registrationPage .registrationForm #firstName');
            const lastNameInput = document.querySelector('main .registrationPage .registrationForm #lastName');
            const emailInput = document.querySelector('main .registrationPage .registrationForm #email');
            const usernameInput = document.querySelector('main .registrationPage .registrationForm .username');
            const password1Input = document.querySelector('main .registrationPage .registrationForm .password1');
            const password2Input = document.querySelector('main .registrationPage .registrationForm .password2');
            const selector = 'main .registrationPage .serverResponse';

            firstNameInput.oninput = () => checkInput.call(firstNameInput, REGEXP_NAME);
            lastNameInput.oninput = () => checkInput.call(lastNameInput, REGEXP_NAME);
            emailInput.oninput = () => checkInput.call(emailInput, REGEXP_EMAIL);
            usernameInput.oninput = () => checkInput.call(usernameInput, REGEXP_USERNAME);
            password1Input.oninput = () => checkInput.call(password1Input, REGEXP_PASSWORD);
            password2Input.oninput = () => checkPasswordCompliance(password1Input, password2Input);
            
            const button = document.querySelector('main .registrationPage .registrationForm #toRegistrationVerificationPage');
            button.onclick = () => checkEmptiness(selector, () => {
                if (!errors) {
                    const firstName = firstNameInput.value.trim();
                    const lastName = lastNameInput.value.trim();
                    const email = emailInput.value.trim();
                    const username = usernameInput.value.trim();
                    const password = password2Input.value.trim();
                    const params = `firstName=${firstName}&lastName=${lastName}&email=${email}&username=${username}&password=${password}`;
    
                    makePostRequest(REGISTRATION_CHECKS_PHP[0], params, () => processPreliminaryResponse(selector, REGISTRATION_VERIFICATION_PAGE));
                }
            }, firstNameInput, lastNameInput, emailInput, usernameInput, password1Input, password2Input);
            break;
        }

        case SIGN_IN_PAGE: {
            displayPage();

            const usernameLogInInput = document.querySelector('main .startPage .signInForm .username');
            const passwordLogInInput = document.querySelector('main .startPage .signInForm #password');
            const button = document.querySelector('main .startPage .signInForm #signIn');
            const selector = 'main .startPage .serverResponse';

            button.onclick = () => checkEmptiness(selector, () => logIn(usernameLogInInput.value.trim(), passwordLogInInput.value.trim()), usernameLogInInput, passwordLogInInput);
            break;
        }

        case REGISTRATION_VERIFICATION_PAGE: {
            displayPage('main .registrationVerificationPage');

            const input = document.querySelector('main .registrationVerificationPage .registrationVerificationForm .verificationCode');
            const button = document.querySelector('main .registrationVerificationPage .registrationVerificationForm .confirm');
            const selector = 'main .registrationVerificationPage .serverResponse';

            button.onclick = () => checkEmptiness(selector, () => {
                const userInput = input.value.trim();
                const params = `userInput=${userInput}`;
                const selector = 'main .startPage .serverResponse';

                makePostRequest(CONFIRM_REGISTRATION_PHP[0], params, () => processFinalResponse(() => {
                    location.hash = SIGN_IN_PAGE;
                    alert('Registration has been successful!');
                }, selector));
            }, input);
            break;
        }

        case RECOVERY_PAGE: {
            displayPage('main .recoveryPage');

            const input = document.querySelector('main .recoveryPage .recoveryForm .username');
            const button = document.querySelector('main .recoveryPage .recoveryForm #toVerificationPage');
            const selector = 'main .recoveryPage .serverResponse';

            button.onclick = () => checkEmptiness(selector, () => {
                const username = input.value.trim();
                const params = `username=${username}`;
                const selector = 'main .recoveryPage .serverResponse';

                makePostRequest(RESTORE_PASSWORD_PHP[0], params, () => processPreliminaryResponse(selector, RECOVERY_VERIFICATION_PAGE));
            }, input);
            break;
        }

        case RECOVERY_VERIFICATION_PAGE: {
            displayPage('main .recoveryVerificationPage');

            const input = document.querySelector('main .recoveryVerificationPage .recoveryVerificationForm .verificationCode');
            const button = document.querySelector('main .recoveryVerificationPage .recoveryVerificationForm .confirm');
            const selector = 'main .recoveryVerificationPage .serverResponse';
            
            button.onclick = () => checkEmptiness(selector, () => {
                const userInput = input.value.trim();
                const params = `userInput=${userInput}`;

                makePostRequest(CONFIRM_RECOVERY_PHP[0], params, () => processPreliminaryResponse(selector, NEW_PASSWORD_PAGE));
            }, input);
                break;
        }

        case NEW_PASSWORD_PAGE: {
            displayPage('main .newPasswordPage');

            const password1Input = document.querySelector('main .newPasswordPage .newPasswordForm .password1');
            const password2Input = document.querySelector('main .newPasswordPage .newPasswordForm .password2');
            const button = document.querySelector('main .newPasswordPage .newPasswordForm .confirm');
            const selector = 'main .newPasswordPage .serverResponse';

            password1Input.oninput = () => checkInput.call(password1Input, REGEXP_PASSWORD);
            password2Input.oninput = () => checkPasswordCompliance(password1Input, password2Input);

            button.onclick = () => checkEmptiness(selector, () => {
                const newPassword = password2Input.value.trim();
                const params = `newPassword=${newPassword}`;
                const selector = 'main .newPasswordPage .serverResponse';
                const message = 'Your password has been changed succefully!';

                makePostRequest(SET_NEW_PASSWORD_PHP[0], params, () => processFinalResponse(() => {
                    location.hash = SIGN_IN_PAGE;
                    alert(message);
                }, selector));
            }, password1Input, password2Input);
            break;
        }

        case CHATS_PAGE: {
            displayPage('main .chatsPage', 'flex');
    
            document.querySelector('main').className = 'nullPadding';
            document.querySelector('main .chatsPage .sidebar #tc2').style.display = 'none';
            
            const allTabs = document.querySelectorAll('main .chatsPage .sidebar .tabs .tab');
            const allContent = document.querySelectorAll('main .chatsPage .sidebar .tabContent');  

            document.querySelector('main .chatsPage .sidebar .tabs').onclick = () => switchTab(event, allTabs, allContent, 'activeTab', 'main .chatsPage .sidebar #tc', 'block');

            document.querySelector('main .chatsPage .sidebar .tabs #t2').onclick = () => {
                const content = document.querySelector('main .chatsPage .sidebar #tc2 .user');  
                
                if (!content) {
                    makePostRequest(GET_ALL_USERS_PHP[0], '', displayAllUsers);
                }
            }

            window.onkeydown = () => pressEnter(event, inId);
            break;
        }

        default: {
            break;
        }
    }
}

function displayPage(elementSelector=null, displayType='block') {
    const pages = document.querySelectorAll('main *');
    const startPage = 'main .startPage';

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
    const out = document.querySelector(outSelector);

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
    const inputs = document.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}

function removeWebhostAd() {
    const elements = document.querySelectorAll('div');
    elements[elements.length - 1].style.display = "none";
}

function makePostRequest(url, params, perform) {
    const xhr = new XMLHttpRequest();
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
    const out = document.querySelector(outSelector);

    if (response == true) {
        location.hash = toPage;
    }
    else {
        out.innerHTML = response;
        out.style.opacity = '1';
    }
}

function processFinalResponse(perform, outSelector) {
    const out = document.querySelector(outSelector);

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
    const params = `username=${username}&password=${password}`;
    const selector = 'main .startPage .serverResponse';

    makePostRequest(LOG_IN_PHP[0], params, () => processFinalResponse(displayChatsPage, selector));
}

function displayChatsPage() {
    location.hash = CHATS_PAGE;

    const requestedInfo = JSON.stringify(['id', 'token']);
    makePostRequest(GET_USER_INFO_PHP[0], `requestedInfo=${requestedInfo}`, () => {
        const info = JSON.parse(response);
        id = info.id;
        token = info.token;
        connect();
        makePostRequest(GET_ALL_CHATS_PHP[0], '', displayAllChats);
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
    const id = Number(((rightTarget.id).match(/\d/g)).join(''));

    rightTarget.classList.add(className);

    if (displayType) {
        document.querySelector(`${contentSelector}${id}`).style.display = displayType;
    }
}

function createChatInterface(interlocutorId, firstName, lastName, number=null, newMessage=null) {
    const chatsPage = document.querySelector('main .chatsPage');
    const chatUI = document.createElement('div');
    const interlocutorInfo = document.createElement('div');
    const messages = document.createElement('div');
    const userForm = document.createElement('form');
    const userInput = document.createElement('div');
    const send = document.createElement('button');
    const wrapDiv = document.createElement('div');

    chatUI.className = 'activeChatInterface';
    chatUI.id = `i${interlocutorId}`;
    interlocutorInfo.className = 'interlocutorInfo';
    interlocutorInfo.innerHTML = `${firstName} ${lastName}`;
    messages.className = 'messages';
    userForm.className = 'userForm';
    userInput.className = 'userInput';
    userInput.setAttribute('contenteditable', 'true');
    userInput.setAttribute('data-text', 'Type a message');
    send.className = 'send';
    send.type = 'button';
    send.innerHTML = 'Send';

    send.onclick = () => {
        processMessage(interlocutorId, messages);
    };

    if (number) {
        const params = `interlocutorId=${interlocutorId}&number=${number}`;

        makePostRequest(GET_MESSAGES_PHP[0], params, () => {
            const messagesContent = JSON.parse(response);

            for (let i = messagesContent.length - 1; i > -1; i--) {
                const message = document.createElement('div');
                
                message.className = messagesContent[i].fromUser == id ? 'userMessage' : 'interlocutorMessage';
                message.innerHTML = messagesContent[i].message;

                messages.appendChild(message);
            }

            if (newMessage) {
                const newMessageBlock = document.createElement('div');

                newMessageBlock.className = 'interlocutorMessage';
                newMessageBlock.innerHTML = newMessage;

                messages.appendChild(newMessageBlock);
            }

            messages.scrollTo(0, messages.scrollHeight);
        });
    }

    chatsPage.appendChild(chatUI);
    chatUI.appendChild(interlocutorInfo);
    chatUI.appendChild(messages);
    chatUI.appendChild(userForm);
    wrapDiv.appendChild(userInput);
    userForm.appendChild(wrapDiv);
    userForm.appendChild(send);

    let num1 = number;
    let top = false;

    messages.onmousewheel = function () {
        if (this.scrollTop <= 200 && !top) {
            const num2 = 50;
            const number = `${num1},${num2}`;
            const params = `interlocutorId=${interlocutorId}&number=${number}`;

            makePostRequest(GET_MESSAGES_PHP[0], params, () => {
                const messagesContent = JSON.parse(response);
                if (messagesContent.length === 0) top = true;
    
                for (let i = 0; i < messagesContent.length; i++) {
                    const message = document.createElement('div');
                    
                    message.className = messagesContent[i].fromUser == id ? 'userMessage' : 'interlocutorMessage';
                    message.innerHTML = messagesContent[i].message;
    
                    messages.prepend(message);
                }
            });

            num1 += 50;
        }
    };
}

function pressEnter(event, interlocutorId) {
    const messages = document.querySelector(`main .chatsPage #i${interlocutorId} .messages`);

    if (messages && event.code === 'Enter') {
        processMessage(interlocutorId, messages, event);
    }
}

function displayAllUsers() {
    const users = JSON.parse(response);
    const usersList = document.querySelector('main .chatsPage .sidebar #tc2');

    for (let i = 0; i < users.length; i++) {
        const user = document.createElement('div');
        const userName = document.createElement('h3');
        const chatButton = document.createElement('button');
        const firstName = users[i].firstName;
        const lastName = users[i].lastName;
        const userId = users[i].id;
        const sidebarChat = document.querySelector(`main .chatsPage .sidebar .tabContent #u${userId}`);
        const sidebarChats = document.querySelectorAll('main .chatsPage .sidebar .tabContent .chat');

        user.className = 'user';
        chatButton.className = 'toChat';
        chatButton.innerHTML = 'Chat';
        userName.innerHTML = `${firstName} ${lastName}`;
        chatButton.onclick = () => {
            let chat = document.querySelector(`main .chatsPage #i${userId}`);
            const chats = document.querySelectorAll('main .chatsPage .activeChatInterface');

            clearActive(chats, sidebarChats);

            if (!chat) {
                const sidebarChat = document.querySelector(`main .chatsPage .sidebar .tabContent #u${userId}`);

                createChatInterface(userId, firstName, lastName, 50);
                chat = document.querySelector(`main .chatsPage #i${userId}`);
                chat.style.display = 'flex';

                if (sidebarChat) {
                    sidebarChat.classList.add('activeChat');
                    inId = userId;
                }
            }
            else if (sidebarChat) {
                chat.style.display = 'flex';
                sidebarChat.classList.add('activeChat');
                inId = userId;
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
    const messages = JSON.parse(response);
    const displayedChats = [];
    const chatsList = document.querySelector('main .chatsPage .sidebar #tc1');

    for (let i = messages.length - 1; i > -1; i--) {
        const interlocutorId = messages[i].fromUser == id ? messages[i].toUser : messages[i].fromUser;

        if (displayedChats.indexOf(interlocutorId) == -1) {
            displayedChats.push(interlocutorId);

            const chat = document.createElement('div');
            const lastMessage = document.createElement('p');
            const name = document.createElement('h3');

            name.className = 'name';
            name.innerHTML = `${messages[i].firstName} ${messages[i].lastName}`;
            chat.className = 'chat';
            chat.id = `u${interlocutorId}`;
            lastMessage.className = 'lastMessage';
            lastMessage.innerHTML = messages[i].message;

            chat.appendChild(name);
            chat.appendChild(lastMessage);
            chatsList.appendChild(chat);
            
            chat.onclick = () => {
                let chatInterface = document.querySelector(`main .chatsPage #i${interlocutorId}`);
                let messagesBlocks = document.querySelector(`main .chatsPage #i${interlocutorId} .messages`);

                if (!chatInterface) {
                    createChatInterface(interlocutorId, messages[i].firstName, messages[i].lastName, 50);
                    chatInterface = document.querySelector(`main .chatsPage #i${interlocutorId}`);
                    messagesBlocks = document.querySelector(`main .chatsPage #i${interlocutorId} .messages`);
                }

                const sidebarChats = document.querySelectorAll('main .chatsPage .sidebar .tabContent .chat');
                const chats = document.querySelectorAll('main .chatsPage .activeChatInterface');

                clearActive(chats, sidebarChats);

                chat.classList.add('activeChat');
                chatInterface.style.display = 'flex';
                messagesBlocks.scrollTo(0, messagesBlocks.scrollHeight);

                inId = interlocutorId;
            }
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
    WebSocketConnection = new WebSocket(`ws://${IP[0]}:8000/?userId=${id}&userToken=${token}`);

    WebSocketConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const fromUser = data.fromUser;
        const message = data.message;

        const chat = document.querySelector(`main .chatsPage #i${fromUser} .messages`);
        let chatsList = document.querySelector('main .chatsPage .sidebar #tc1');
        const sidebarChat = document.querySelector(`main .chatsPage .sidebar #tc1 #u${fromUser}`);
        const newSidebarChat = sidebarChat;

        const newMessage = document.createElement('div');

        newMessage.className = 'interlocutorMessage';
        newMessage.innerHTML = message;

        if (chat) {
            chat.appendChild(newMessage);
            chat.scrollTo(0, chat.scrollHeight);
        }
        else {
            const params = `id=${fromUser}`;

            makePostRequest(GET_FULL_NAME_PHP[0], params, () => {
                const fullName = JSON.parse(response);
                createChatInterface(fromUser, fullName.firstName, fullName.lastName, 50, message);
            });
        }

        if (sidebarChat) {
            chatsList.removeChild(sidebarChat);
            chatsList.prepend(newSidebarChat);
        
            const lastMessage = document.querySelector(`main .chatsPage .sidebar #tc1 #u${fromUser} .lastMessage`);
            lastMessage.innerHTML = message;
        }
        else {
            const params = `id=${fromUser}`;

            makePostRequest(GET_FULL_NAME_PHP[0], params, () => {
                const chat = document.createElement('div');
                let lastMessage = document.createElement('p');
                const name = document.createElement('h3');
                const fullName = JSON.parse(response);

                name.className = 'name';
                name.innerHTML = `${fullName.firstName} ${fullName.lastName}`;
                chat.className = 'chat';
                chat.id = `u${fromUser}`;
                lastMessage.className = 'lastMessage';
                lastMessage.innerHTML = message;

                chat.appendChild(name);
                chat.appendChild(lastMessage);
                chatsList.prepend(chat);
                
                chat.onclick = () => {
                    let chatInterface = document.querySelector(`main .chatsPage #i${fromUser}`);

                    if (!chatInterface) {
                        createChatInterface(fromUser, fullName.firstName, fullName.lastName, 50);
                        chatInterface = document.querySelector(`main .chatsPage #i${fromUser}`);
                    }

                    const sidebarChats = document.querySelectorAll('main .chatsPage .sidebar .tabContent .chat');
                    const chats = document.querySelectorAll('main .chatsPage .activeChatInterface');

                    clearActive(chats, sidebarChats);

                    chat.classList.add('activeChat');
                    chatInterface.style.display = 'flex';
                }
            });
        }
    };
}

function sendMessage(interlocutorId, message, chat) {
    let data = {
        fromUser: id,
        toUser: interlocutorId,
        message: message
    };
    data = JSON.stringify(data);
    WebSocketConnection.send(data);

    const chatsList = document.querySelector('main .chatsPage .sidebar #tc1');
    const sidebarChat = document.querySelector(`main .chatsPage .sidebar #tc1 #u${interlocutorId}`);
    const newSidebarChat = sidebarChat;
    const messageBlock = document.createElement('div');

    messageBlock.className = 'userMessage';
    messageBlock.innerHTML = message;

    chat.appendChild(messageBlock);
    chat.scrollTo(0, chat.scrollHeight);

    if (sidebarChat) {    
        chatsList.removeChild(sidebarChat);
        chatsList.prepend(newSidebarChat);
    
        const lastMessage = document.querySelector(`main .chatsPage .sidebar #tc1 #u${interlocutorId} .lastMessage`);
        lastMessage.innerHTML = message;
    }
    else {
        const params = `id=${interlocutorId}`;

        makePostRequest(GET_FULL_NAME_PHP[0], params, () => {
            const chat = document.createElement('div');
            let lastMessage = document.createElement('p');
            const name = document.createElement('h3');
            const fullName = JSON.parse(response);

            name.className = 'name';
            name.innerHTML = `${fullName.firstName} ${fullName.lastName}`;
            chat.className = 'chat';
            chat.id = `u${interlocutorId}`;
            lastMessage.className = 'lastMessage';
            lastMessage.innerHTML = message;

            chat.appendChild(name);
            chat.appendChild(lastMessage);
            chatsList.prepend(chat);
            
            chat.onclick = makeActive;

            makeActive();   

            function makeActive() {
                const chatInterface = document.querySelector(`main .chatsPage #i${interlocutorId}`);
                const sidebarChats = document.querySelectorAll('main .chatsPage .sidebar .tabContent .chat');
                const chats = document.querySelectorAll('main .chatsPage .activeChatInterface');

                clearActive(chats, sidebarChats);

                chat.classList.add('activeChat');
                chatInterface.style.display = 'flex';
            }
        });
    }
}

function processMessage(interlocutorId, messages, event) {
    event.preventDefault();

    const userInput = document.querySelector(`main .chatsPage #i${interlocutorId} .userForm .userInput`);

    if (userInput.innerText.trim().match(REGEXP_TAG)) {
        alert('Вийди, розбійнику!!!');
    }

    const message = userInput.innerText.trim().replace(REGEXP_TAG, '').replace(REGEXP_SPECIAL,'');

    if (message !== '') {
        sendMessage(interlocutorId, message, messages);
    }

    userInput.innerHTML = '';
}