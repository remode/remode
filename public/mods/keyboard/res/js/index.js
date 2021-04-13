let keyboardInputElement = document.getElementById("keyboardInput")
let passwordInputElement = document.getElementById("passwordInput")

keyboardInputElement.oninput = function () {
    if (keyboardInputElement.value != "") {
        sendKey(
            keyboardInputElement.value[keyboardInputElement.value.length - 1],
            passwordInputElement.value
        );
        setTimeout(() => {
            keyboardInputElement.value = keyboardInputElement.value.slice(1);
        }, 1000)
    }
}
