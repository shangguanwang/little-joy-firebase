// import Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref , push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//set up the real-time database using Firebase
const appSettings = {
    databaseURL: "https://little-joy-5cc01-default-rtdb.firebaseio.com/"
} //replace this link with your own Firebase url

const app = initializeApp(appSettings)
const database = getDatabase(app)
const joyDB = ref(database, "JoyList") //give it the database and a customized name

//import textarea and button from html and add event listener
const textareaEl = document.getElementById('input-field'); 
const buttonEl = document.getElementById('publish-button');
const data = document.getElementById('joyContainer')

//add today's date above the textarea
const d = new Date();
const dateplaceholder = document.getElementById("todaydate")
dateplaceholder.innerHTML += d.toLocaleDateString();


// add event listener to the button that does 2 things, push the data to database and clear the textarea
buttonEl.addEventListener("click", function(event){
    let inputValue = textareaEl.value
    //prevent empty inputs
    if (inputValue === '') {
        event.preventDefault();
        alert('Please enter some text before submitting.');
      }
    else {
    // Get the current date
    const currentDate = d.toLocaleDateString();
     // Create a new object containing the current date and the user's input
    const data = {
    date: currentDate,
    input: inputValue
    };
    push(joyDB, data) //push the data object to the database
    clearInput() //clear the textarea box automatically to improve user experience
    }
})

//fetch database item in real time using onValue, this is in case someone else already added inputs to the database before, we want to display them in this new session
onValue(joyDB, function(snapshot){
    let joyArr = Object.values(snapshot.val()) // joinArr is an array of objects
    clearPage()
    for (let i=joyArr.length-1; i>=0; i--){
    addInput(joyArr[i])}
})

//use createElement to display the current date and user input on the page
function addInput(obj) {
    let dateEl = document.createElement("b")
    dateEl.textContent = obj.date
    data.append(dateEl)

    let textEl = document.createElement("p")
    textEl.textContent = obj.input
    data.append(textEl)
}

// clear the input box when the button is clicked
function clearInput() {
    textareaEl.value=""
}

//clear the page
function clearPage() {
    data.innerHTML = "" 
}
//****************     Heart Icon    ******************/
//make the heart icon clickable
const heartDB = ref(database, "HeartCount") //create a second database in Firebase to record the heart number

const heart = document.getElementById("heart-icon");
const heartcount = document.getElementById("heart-count")


heart.addEventListener("click", function() {
    heart.style.color = "#FF7968"
    let count = 1
    push(heartDB, count)
    heartcount = ""
    //heart.classList.remove("heart-icon")
}, {once:true})

// fetch the heart count value in real time from the database
onValue(heartDB, function(snapshot){
    let heartArr = Object.values(snapshot.val())
    heartcount.innerHTML = "" //clear the heart count
    heartcount.innerHTML = heartArr.length
})