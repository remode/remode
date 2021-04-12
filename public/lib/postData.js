/**
 * @param {string} location Location
 * @param {BodyInit} body JSON data to send to the server
 * @param {HeadersInit} headers (Optional) HTTP headers to send to the server
 */
function postData(location, body, headers = { "Content-Type": "application/json" }) {
    fetch(location, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}