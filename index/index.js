let keyboardInputElement = document.getElementById("keyboardInput")
let passwordInputElement = document.getElementById("passwordInput")

keyboardInputElement.oninput = function () {
    if (keyboardInputElement.value != "") {
        postData(
            {
                "passwd": passwordInputElement.value,
                "type": "keyInput",
                "value": keyboardInputElement.value[keyboardInputElement.value.length - 1],
            }
        );
        setTimeout(() => {
            keyboardInputElement.value = keyboardInputElement.value.slice(1);
        }, 1000)
    }
}

function postData(data) {

    fetch('192.168.1.1:3000', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}