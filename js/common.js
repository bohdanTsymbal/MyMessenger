'use strict';

let errors, response, id, inId, token, WebSocketConnection, sHeight;

errors = true;

window.onhashchange = () => navigate(location.hash);

const params = 'param=id&unset=0';
makePostRequest(CHECK_SESSION_PHP[0], params, checkSession);

function navigate(hash) {
    switch (hash) {
        case REGISTARTION_PAGE: {
            displayPage('.registrationPage');

            const inputs = {
                firstNameInput: document.querySelector('.registrationForm #firstName'),
                lastNameInput: document.querySelector('.registrationForm #lastName'),
                emailInput: document.querySelector('.registrationForm #email'),
                usernameInput: document.querySelector('.registrationForm .username'),
                password1Input: document.querySelector('.registrationForm .password1'),
                password2Input: document.querySelector('.registrationForm .password2')
            };
            const selector = '.registrationPage .serverResponse';

            inputs.firstNameInput.oninput = () => checkInput.call(inputs.firstNameInput, REGEXP_NAME);
            inputs.lastNameInput.oninput = () => checkInput.call(inputs.lastNameInput, REGEXP_NAME);
            inputs.emailInput.oninput = () => checkInput.call(inputs.emailInput, REGEXP_EMAIL);
            inputs.usernameInput.oninput = () => checkInput.call(inputs.usernameInput, REGEXP_USERNAME);
            inputs.password1Input.oninput = () => checkInput.call(inputs.password1Input, REGEXP_PASSWORD);
            inputs.password2Input.oninput = () => checkPasswordCompliance(inputs.password1Input, inputs.password2Input);
            
            const form = document.querySelector('.registrationForm');
            form.onsubmit = (event) => {
                event.preventDefault();

                checkEmptiness(selector, () => getServerResponce(inputs, REGISTRATION_CHECKS_PHP[0], selector, processPreliminaryResponse, REGISTRATION_VERIFICATION_PAGE), inputs);
            }    

            break;
        }

        case SIGN_IN_PAGE: {
            displayPage();

            const usernameLogInInput = document.querySelector('.signInForm .username');
            const passwordLogInInput = document.querySelector('.signInForm #password');
            const form = document.querySelector('.signInForm');
            const selector = '.startPage .serverResponse';

            form.onsubmit = (event) => {
                event.preventDefault();

                checkEmptiness(selector, () => logIn(usernameLogInInput.value.trim(), passwordLogInInput.value.trim()), [usernameLogInInput, passwordLogInInput]);
            }

            break;
        }

        case REGISTRATION_VERIFICATION_PAGE: {
            displayPage('.registrationVerificationPage');

            const inputs = {
                userCodeInput: document.querySelector('.registrationVerificationForm .verificationCode')
            };
            const form = document.querySelector('.registrationVerificationForm');
            const selector = '.registrationVerificationPage .serverResponse';

            form.onsubmit = (event) => {
                event.preventDefault();
                checkEmptiness(selector, () => getServerResponce(inputs, CONFIRM_REGISTRATION_PHP[0], selector, processFinalResponse, () => completeOperation(SIGN_IN_PAGE, 'Registration has been successful!')), inputs);
            }

            break;
        }

        case RECOVERY_PAGE: {
            displayPage('.recoveryPage');

            const inputs = {
                usernameInput: document.querySelector('.recoveryForm .username')
            };
            const form = document.querySelector('.recoveryForm');
            const selector = '.recoveryPage .serverResponse';

            form.onsubmit = (event) => {
                event.preventDefault();
                errors = false;

                checkEmptiness(selector, () => getServerResponce(inputs, RESTORE_PASSWORD_PHP[0], selector, processPreliminaryResponse, RECOVERY_VERIFICATION_PAGE), inputs);
            }

            break;
        }

        case RECOVERY_VERIFICATION_PAGE: {
            displayPage('.recoveryVerificationPage');
            
            const inputs = {
                userCodeInput: document.querySelector('.recoveryVerificationForm .verificationCode')
            };
            const form = document.querySelector('.recoveryVerificationForm');
            const selector = '.recoveryVerificationPage .serverResponse';
            
            form.onsubmit = (event) => {
                event.preventDefault();

                checkEmptiness(selector, () => getServerResponce(inputs, CONFIRM_RECOVERY_PHP[0], selector, processPreliminaryResponse, NEW_PASSWORD_PAGE), inputs);
            }

            break;
        }

        case NEW_PASSWORD_PAGE: {
            displayPage('.newPasswordPage');

            const inputs = {
                password1Input: document.querySelector('.newPasswordForm .password1'),
                password2Input: document.querySelector('.newPasswordForm .password2')
            };
            const form = document.querySelector('.newPasswordForm');
            const selector = '.newPasswordPage .serverResponse';

            inputs.password1Input.oninput = () => checkInput.call(inputs.password1Input, REGEXP_PASSWORD);
            inputs.password2Input.oninput = () => checkPasswordCompliance(inputs.password1Input, inputs.password2Input);

            form.onsubmit = (event) => {
                event.preventDefault();

                checkEmptiness(selector, () => getServerResponce(inputs, SET_NEW_PASSWORD_PHP[0], selector, processFinalResponse, () => completeOperation(SIGN_IN_PAGE, 'Your password has been changed succefully!')), inputs);
            }

            break;
        }

        case CHATS_PAGE: {
            displayPage('.chatsPage', 'flex');
    
            document.querySelector('main').className = 'nullPadding';
            document.querySelector('.sidebar #tc2').style.display = 'none';
            
            const allTabs = document.querySelectorAll('.tabs .tab');
            const allContent = document.querySelectorAll('.sidebar .tabContent');  

            document.querySelector('.sidebar .tabs').onclick = () => switchTab(event, allTabs, allContent, 'activeTab', '.sidebar #tc', 'block');

            document.querySelector('.tabs #t2').onclick = () => {
                const content = document.querySelector('#tc2 .user');  
                
                if (!content) {
                    makePostRequest(GET_ALL_USERS_PHP[0], '', displayAllUsers);
                }
            }

            window.onkeydown = (event) => pressEnter(event, inId);

            break;
        }

        default: {
            break;
        }
    }
}

function checkSession() {
    if (response) {
        location.hash = CHATS_PAGE;
        navigate(CHATS_PAGE);
        displayChatsPage();
    }
    else {
        location.hash = SIGN_IN_PAGE;
        navigate(SIGN_IN_PAGE);        
    }
}

function completeOperation(toPage, message) {
    location.hash = toPage;
    alert(message);
}

function displayPage(elementSelector=null, displayType='block') {
    const pages = document.querySelectorAll('main *');
    const startPage = '.startPage';

    for (let i = 0; i < pages.length; i++) {
        pages[i].removeAttribute('style');
    }

    if (elementSelector) {
        document.querySelector(startPage).style.display = 'none';
        document.querySelector(elementSelector).style.display = displayType;
    }
}

function checkEmptiness(outSelector, perform, elements) {
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
    const alertId = this.id !== '' ? this.id : this.className.replace(/error/, '').trim();

    if (!pattern.test(this.value.trim())) {
        this.classList.add('error');
        document.querySelector(`.${this.parentNode.className} #${alertId}Alert`).classList.add('active');

        errors = true;
    }
    else {
        this.classList.remove('error');
        document.querySelector(`.${this.parentNode.className} #${alertId}Alert`).classList.remove('active');

        errors = false;
    }
}

function checkPasswordCompliance(firstElement, secondElement) {
    const alertId = secondElement.className.replace(/error/, '').trim();

    if (firstElement.value.trim() != secondElement.value.trim() || !REGEXP_PASSWORD.test(secondElement.value.trim())) {
        firstElement.classList.add('error');
        secondElement.classList.add('error');
        document.querySelector(`.${secondElement.parentNode.className} #${alertId}Alert`).classList.add('active');

        errors = true;
    }
    else {
        firstElement.classList.remove('error');
        secondElement.classList.remove('error');
        document.querySelector(`.${secondElement.parentNode.className} #${alertId}Alert`).classList.remove('active');

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

function getServerResponce(inputs, api, selector, callback, callbackParam) {
    if (!errors) {
        let params = "";

        for (let key in inputs) {
            const value = inputs[key].value.trim();
            const newKey = key.replace('Input', '').replace(/\d/g, '');
            params += `${newKey}=${value}&`;
            if (newKey === 'password') break;
        }
        params = params.slice(0, params.length - 1);

        makePostRequest(api, params, () => callback(callbackParam, selector));
    }
}

function processPreliminaryResponse(toPage, outSelector) {
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
    const selector = '.startPage .serverResponse';

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
    const chatsPage = document.querySelector('.chatsPage');
    const sidebar = document.querySelector('.chatsPage .sidebar');
    const chatUI = document.createElement('div');
    const interlocutorInfo = document.createElement('div');
    const span = document.createElement('span');
    const backBtn = document.createElement('button');
    const messages = document.createElement('div');
    const userForm = document.createElement('form');
    const userInput = document.createElement('div');
    const send = document.createElement('button');

    chatUI.className = 'activeChatInterface';
    chatUI.id = `i${interlocutorId}`;
    interlocutorInfo.className = 'interlocutorInfo';
    span.innerHTML = `${firstName} ${lastName}`;
    backBtn.className = 'back';
    backBtn.type = 'button';
    backBtn.innerHTML = '&#8249;';
    messages.className = 'messages';
    userForm.className = 'userForm';
    userInput.className = 'userInput';
    userInput.setAttribute('contenteditable', 'true');
    userInput.setAttribute('data-text', 'Type a message');
    send.className = 'send';
    send.type = 'button';
    send.innerHTML = 'Send';

    send.onclick = () => processMessage(interlocutorId, messages);

    backBtn.onclick = () => {
        chatUI.style.display = 'none';
        sidebar.style.display = 'block';
    };

    if (number) {
        const params = `interlocutorId=${interlocutorId}&number=0_${number}`;

        makePostRequest(GET_MESSAGES_PHP[0], params, () => {
            const messagesContent = JSON.parse(response);

            for (let i = messagesContent.length - 1; i > -1; i--) {
                const message = document.createElement('div');
                const sendingTime = document.createElement('span');
                const date = new Date(messagesContent[i].sendingTime);

                sendingTime.className = 'sendingTime';
                sendingTime.innerHTML = `${date.getHours() - new Date().getTimezoneOffset() / 60}:${String(date.getMinutes()).padStart(2, '0')}`;
                
                message.className = messagesContent[i].fromUser == id ? 'userMessage' : 'interlocutorMessage';
                message.innerHTML = messagesContent[i].message;

                message.appendChild(sendingTime);
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
    interlocutorInfo.appendChild(backBtn);
    interlocutorInfo.appendChild(span);
    chatUI.appendChild(messages);
    chatUI.appendChild(userForm);
    userForm.appendChild(userInput);
    userForm.appendChild(send);

    let num1 = number;
    let top = false;

    messages.onmousewheel = function () {
        if (this.scrollTop <= 200 && !top) {
            const num2 = 50;
            const number = `${num1}_${num2}`;
            const params = `interlocutorId=${interlocutorId}&number=${number}`;

            makePostRequest(GET_MESSAGES_PHP[0], params, () => {
                const messagesContent = JSON.parse(response);
                top = messagesContent.length === 0;
    
                for (let i = 0; i < messagesContent.length; i++) {
                    const message = document.createElement('div');
                    const sendingTime = document.createElement('span');
                    const date = new Date(messagesContent[i].sendingTime);

                    sendingTime.className = 'sendingTime';
                    sendingTime.innerHTML = `${date.getHours() - new Date().getTimezoneOffset() / 60}:${String(date.getMinutes()).padStart(2, '0')}`;
                    
                    message.className = messagesContent[i].fromUser == id ? 'userMessage' : 'interlocutorMessage';
                    message.innerHTML = messagesContent[i].message;
    
                    message.appendChild(sendingTime);
                    messages.prepend(message);
                }
            });

            num1 += 50;
        }
    };
}

function pressEnter(event, interlocutorId) {
    const messages = document.querySelector(`#i${interlocutorId} .messages`);

    if (messages && event.code === 'Enter') {
        processMessage(interlocutorId, messages, event);
    }
}

function displayAllUsers() {
    const users = JSON.parse(response);
    const usersList = document.querySelector('.sidebar #tc2');

    for (let i = 0; i < users.length; i++) {
        const user = document.createElement('div');
        const userName = document.createElement('h3');
        const chatButton = document.createElement('button');
        const firstName = users[i].firstName;
        const lastName = users[i].lastName;
        const userId = users[i].id;
        const sidebarChat = document.querySelector(`.tabContent #u${userId}`);
        const sidebarChats = document.querySelectorAll('.tabContent .chat');
        const sidebar = document.querySelector('.chatsPage .sidebar');

        user.className = 'user';
        chatButton.className = 'toChat';
        chatButton.innerHTML = 'Chat';
        userName.innerHTML = `${firstName} ${lastName}`;
        chatButton.onclick = () => {
            let chat = document.querySelector(`.chatsPage #i${userId}`);
            const chats = document.querySelectorAll('.chatsPage .activeChatInterface');

            clearActive(chats, sidebarChats);

            if (!chat) {
                const sidebarChat = document.querySelector(`.tabContent #u${userId}`);

                createChatInterface(userId, firstName, lastName, 50);
                chat = document.querySelector(`.chatsPage #i${userId}`);
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

            if (document.documentElement.clientWidth <= 768) {
                sidebar.style.display = 'none';
                if (sidebarChat) sidebarChat.classList.remove('activeChat');
            }
            inId = userId;
        };

        usersList.appendChild(user);
        user.appendChild(userName);
        user.appendChild(chatButton);
    }
}

function displayAllChats() {
    const messages = JSON.parse(response);
    const displayedChats = [];
    const chatsList = document.querySelector('.sidebar #tc1');

    for (let i = messages.length - 1; i > -1; i--) {
        const interlocutorId = messages[i].fromUser == id ? messages[i].toUser : messages[i].fromUser;

        if (displayedChats.indexOf(interlocutorId) == -1) {
            displayedChats.push(interlocutorId);

            const chat = document.createElement('div');
            const lastMessage = document.createElement('p');
            const name = document.createElement('h3');
            const lastMessageSendingTime = document.createElement('span');
            const sidebar = document.querySelector('.chatsPage .sidebar');
            const date = new Date(messages[i].sendingTime);

            name.className = 'name';
            name.innerHTML = `${messages[i].firstName} ${messages[i].lastName}`;
            chat.className = 'chat';
            chat.id = `u${interlocutorId}`;
            lastMessage.className = 'lastMessage';
            lastMessage.innerHTML = messages[i].message;
            lastMessageSendingTime.className = 'lastMessageSendingTime';
            lastMessageSendingTime.innerHTML = `${date.getHours() - new Date().getTimezoneOffset() / 60}:${String(date.getMinutes()).padStart(2, '0')}`;

            chat.appendChild(name);
            chat.appendChild(lastMessageSendingTime);
            chat.appendChild(lastMessage);
            chatsList.appendChild(chat);
            
            chat.onclick = () => {
                let chatInterface = document.querySelector(`.chatsPage #i${interlocutorId}`);
                let messagesBlocks = document.querySelector(`#i${interlocutorId} .messages`);

                if (!chatInterface) {
                    createChatInterface(interlocutorId, messages[i].firstName, messages[i].lastName, 50);
                    chatInterface = document.querySelector(`.chatsPage #i${interlocutorId}`);
                    messagesBlocks = document.querySelector(`#i${interlocutorId} .messages`);
                }

                const sidebarChats = document.querySelectorAll('.tabContent .chat');
                const chats = document.querySelectorAll('.chatsPage .activeChatInterface');

                clearActive(chats, sidebarChats);

                chat.classList.add('activeChat');
                chatInterface.style.display = 'flex';
                messagesBlocks.scrollTo(0, messagesBlocks.scrollHeight);

                if (document.documentElement.clientWidth <= 768) {
                    sidebar.style.display = 'none';
                    chat.classList.remove('activeChat');
                }

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
    WebSocketConnection = new WebSocket(`ws://${IP[0]}:0666/?userId=${id}&userToken=${token}`);

    WebSocketConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case 'message': {
                const fromUser = data.fromUser;
                const message = data.message;
        
                const chat = document.querySelector(`#i${fromUser} .messages`);
                let chatsList = document.querySelector('.sidebar #tc1');
                const sidebarChat = document.querySelector(`#tc1 #u${fromUser}`);
                const newSidebarChat = sidebarChat;
        
                const newMessage = document.createElement('div');
                const sendingTime = document.createElement('span');
                const date = new Date(data.sendingTime);
                const sendingTimeValue = `${date.getHours() - new Date().getTimezoneOffset() / 60}:${String(date.getMinutes()).padStart(2, '0')}`;
        
                sendingTime.className = 'sendingTime';
                sendingTime.innerHTML = sendingTimeValue;
        
                newMessage.className = 'interlocutorMessage';
                newMessage.innerHTML = message;
        
                newMessage.appendChild(sendingTime);
        
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
                
                    const lastMessage = document.querySelector(`#u${fromUser} .lastMessage`);
                    const lastMessageSendingTime = document.querySelector(`#u${fromUser} .lastMessageSendingTime`);

                    lastMessage.innerHTML = message;
                    lastMessageSendingTime.innerHTML = sendingTimeValue;
                }
                else {
                    const params = `id=${fromUser}`;
        
                    makePostRequest(GET_FULL_NAME_PHP[0], params, () => {
                        const chat = document.createElement('div');
                        const lastMessage = document.createElement('p');
                        const lastMessageSendingTime = document.createElement('span');
                        const name = document.createElement('h3');
                        const fullName = JSON.parse(response);
        
                        name.className = 'name';
                        name.innerHTML = `${fullName.firstName} ${fullName.lastName}`;
                        chat.className = 'chat';
                        chat.id = `u${fromUser}`;
                        lastMessage.className = 'lastMessage';
                        lastMessage.innerHTML = message;
                        lastMessageSendingTime.className = 'lastMessageSendingTime';
                        lastMessageSendingTime.innerHTML = sendingTimeValue;
        
                        chat.appendChild(name);
                        chat.appendChild(lastMessageSendingTime);
                        chat.appendChild(lastMessage);
                        chatsList.prepend(chat);
                        
                        chat.onclick = () => {
                            let chatInterface = document.querySelector(`.chatsPage #i${fromUser}`);
        
                            if (!chatInterface) {
                                createChatInterface(fromUser, fullName.firstName, fullName.lastName, 50);
                                chatInterface = document.querySelector(`.chatsPage #i${fromUser}`);
                            }
        
                            const sidebarChats = document.querySelectorAll('.tabContent .chat');
                            const chats = document.querySelectorAll('.chatsPage .activeChatInterface');
        
                            clearActive(chats, sidebarChats);
        
                            chat.classList.add('activeChat');
                            chatInterface.style.display = 'flex';
                        }
                    });
                }

                break;
            }

            case 'sendingTime': {
                const data = JSON.parse(event.data);
                addMessageToChat(data.toUser, data.message, data.sendingTime);

                break;
            }

            default:
                break;
        }
    };
}

function sendMessage(interlocutorId, message) {
    let messageData = {
        fromUser: id,
        toUser: interlocutorId,
        message: message
    };

    messageData = JSON.stringify(messageData);
    WebSocketConnection.send(messageData);
}

function addMessageToChat(interlocutorId, message, time) {
    const chatsList = document.querySelector('.sidebar #tc1');
    const sidebarChat = document.querySelector(`#tc1 #u${interlocutorId}`);
    const chat = document.querySelector(`#i${interlocutorId} .messages`);
    const newSidebarChat = sidebarChat;
    const messageBlock = document.createElement('div');
    const sendingTime = document.createElement('span');
    const date = new Date(time);
    const sendingTimeValue = `${date.getHours() - new Date().getTimezoneOffset() / 60}:${String(date.getMinutes()).padStart(2, '0')}`;

    sendingTime.className = 'sendingTime';
    sendingTime.innerHTML = sendingTimeValue;

    messageBlock.className = 'userMessage';
    messageBlock.innerHTML = message;

    messageBlock.appendChild(sendingTime);
    chat.appendChild(messageBlock);
    chat.scrollTo(0, chat.scrollHeight);

    if (sidebarChat) {    
        chatsList.removeChild(sidebarChat);
        chatsList.prepend(newSidebarChat);
    
        const lastMessage = document.querySelector(`#u${interlocutorId} .lastMessage`);
        const lastMessageSendingTime = document.querySelector(`#u${interlocutorId} .lastMessageSendingTime`);

        lastMessage.innerHTML = message;
        lastMessageSendingTime.innerHTML = sendingTimeValue;
    }
    else {
        const params = `id=${interlocutorId}`;

        makePostRequest(GET_FULL_NAME_PHP[0], params, () => {
            const chat = document.createElement('div');
            const lastMessage = document.createElement('p');
            const lastMessageSendingTime = document.createElement('p');
            const name = document.createElement('h3');
            const fullName = JSON.parse(response);

            name.className = 'name';
            name.innerHTML = `${fullName.firstName} ${fullName.lastName}`;
            chat.className = 'chat';
            chat.id = `u${interlocutorId}`;
            lastMessage.className = 'lastMessage';
            lastMessage.innerHTML = message;
            lastMessageSendingTime.className = 'lastMessageSendingTime';
            lastMessageSendingTime.innerHTML = sendingTimeValue;

            chat.appendChild(name);
            chat.appendChild(lastMessageSendingTime);
            chat.appendChild(lastMessage);
            chatsList.prepend(chat);
            
            chat.onclick = makeActive;

            makeActive();   

            function makeActive() {
                const chatInterface = document.querySelector(`.chatsPage #i${interlocutorId}`);
                const sidebarChats = document.querySelectorAll('.tabContent .chat');
                const chats = document.querySelectorAll('.chatsPage .activeChatInterface');

                clearActive(chats, sidebarChats);

                chat.classList.add('activeChat');
                chatInterface.style.display = 'flex';
            }
        });
    }
}

function processMessage(interlocutorId, messages, event) {
    event.preventDefault();

    const userInput = document.querySelector(`#i${interlocutorId} .userForm .userInput`);
    const message = userInput.innerText.trim().replace(REGEXP_TAG, '').replace(REGEXP_SPECIAL,'');

    if (message !== '') {
        sendMessage(interlocutorId, message, messages);
    }

    userInput.innerHTML = '';
}