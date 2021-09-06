const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templatess
const messageTemplates = document.querySelector('#message-template').innerHTML
const locationMessageTemplates = document.querySelector('#location-message-template').innerHTML

//options
const {username} = Qs.parse(location.search, {ignoreQueryPrefix: true})
// const autoscroll = () => {
//     //new message element
//     const $newMessage = $messages.lastElementChild

//     // hieght of the new message
//     const newMessageStyles = getComputedStyle($newMessage)
//     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
//     const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
//     const visibleHeight = $messages.offsetHeight

//     const containerHeight = $messages.scrollHeight

//     const scrollOffsett = $messages.scrollTop + visibleHeight
//     if(containerHeight - newMessageHeight <= scrollOffsett) {
//         $messages.scrollTop = $messages.scrollHeight
//     }
// }
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html =  Mustache.render(messageTemplates, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html =  Mustache.render(locationMessageTemplates, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('usersData', ({users}) => {
    console.log(users)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')


    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (message) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()
        console.log('message sent.', message)
    })
})


$sendLocation.addEventListener('click', () => {
    $sendLocation.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('oppps!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        $sendLocation.removeAttribute('disabled')
    })
})

socket.emit('join', {username}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
