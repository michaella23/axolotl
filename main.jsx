import { initializeApp } from 'firebase/app'
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  set, 
  remove
} from 'firebase/database'

import { 
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyATzOccNKD_YyFBWon3eFvttTBt43ou4j8",
    authDomain: "axolotl-marathon.firebaseapp.com",
    databaseURL: "https://axolotl-marathon-default-rtdb.firebaseio.com",
    projectId: "axolotl-marathon",
    storageBucket: "axolotl-marathon.appspot.com",
    messagingSenderId: "209634047948",
    appId: "1:209634047948:web:89d4bfc60ccfd2ff3fcf69"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider


const signInWithGoogleBtn = document.getElementById("sign-in-with-google-btn")
const signOutBtn = document.getElementById("sign-out-btn")

signInWithGoogleBtn.addEventListener("click", authSignInWithGoogle)
signOutBtn.addEventListener("click", function() {
  signOut(auth)
})

const loginModal = document.querySelector(".login-modal")
const main = document.querySelector("main")
const table = document.querySelector(".table-data")
const formEl = document.getElementById("form-el")
const dateEl = document.getElementById("date-el")
const poolNameEl = document.getElementById("pool-name")
const lapEl = document.getElementById("lap-num")
const totalEl = document.getElementById("total-el")

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    getSnapshot()
    main.style.display = "flex"
    table.style.display = "table"
    loginModal.style.display = "none"
    signOutBtn.style.display = "block"
  } else {
    // User is signed out
    main.style.display = "none"
    table.style.display = "none"
    loginModal.style.display = "flex"
    signOutBtn.style.display = "none"
  }
});

function authSignInWithGoogle() {
  signInWithPopup(auth, provider)
  .then((result) => {
    console.log(result)
    console.log("Signed in with Google")
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage)
  });
  
}

  // get current date
  const today = new Date();
  // format the date to YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  // set input default
  dateEl.value = formattedDate
  
  formEl.addEventListener("submit", calculateDailyMiles)

let yards
const yardsPerMile = 1760
// const metersPerMile = 1609

// Austin pools with different lap lengths
function getTotalYards(pool) {
  switch (pool) {
    case "stacy":
      yards = 66;
      break
    case "eddy":
      yards = 66;
      break
    case "other":
      if (poolNameEl.value && distance.value) {
        yards = getPoolDetails()
        resetOtherPoolForm()
      } else {
        yards = 50
      }
      break
    default:
      yards = 50;
    }
}

const otherFormEl = document.getElementById("other-pool-form")
const otherPoolName = document.getElementById("other-pool-name")
const distance = document.getElementById("distance")
const units = document.getElementById("units")

poolNameEl.addEventListener("change", function() {
  if (poolNameEl.value === "other") {
    runEdgeCase()
  }
})

const otherDistanceBtn = document.getElementById("submit-btn-2")
otherDistanceBtn.addEventListener("click", getPoolDetails)
const backBtn = document.getElementById("back-btn")
backBtn.addEventListener("click", function() {
  otherFormEl.classList.remove("visible")
  poolNameEl.value = "select"
})

function runEdgeCase() {
  otherFormEl.classList.add("visible")
}


function getPoolDetails() {
  otherFormEl.classList.remove("visible")
  if (units.value === "yards") {
    yards = distance.value * 2
  } else if (units.value === "meters") {
    yards = (distance.value * 1.093) * 2
  }
  // resetOtherPoolForm()
  return yards
}

// gets miles and also pushes daily entry to DB
function calculateDailyMiles(e) {
    e.preventDefault();
    const userLapsInDb = ref(db, `users/${auth.currentUser.uid}/lapsRef`)
    let allFieldsComplete = true
    let totalMiles = 0
    let dateVal = dateEl.value;
    let lapsVal = Number(lapEl.value);
    if (lapsVal <= 0) {
      alert("How many laps did you swim?")
      lapsVal = 0
    }
    let poolName = poolNameEl.value;
    if (poolName === "select") {
      alert("Which pool did you go to swim?")
      poolName = "select"
      allFieldsComplete = false
    }
    getTotalYards(poolName);
    let totalYards = lapsVal * yards;
    const dailyMiles = Number((totalYards / yardsPerMile).toFixed(1));
    totalMiles += dailyMiles
    const thisEntry = {
      date: dateVal,
      laps: lapsVal,
      miles: dailyMiles,
      pool: poolName
    };
    if (allFieldsComplete) {
      push(userLapsInDb, thisEntry)
      getSnapshot()
      resetForm()
      }
    }
    
const statsEl = document.getElementById("stats-el")
    
function getSnapshot() {
  // two references per user: the lap object, and total miles
  const userLapsInDb = ref(db, `users/${auth.currentUser.uid}/lapsRef`)
  const userTotalInDb = ref(db, `users/${auth.currentUser.uid}/totalRef`)
  // gathers all data currently in DB
  onValue(userLapsInDb, function(snapshot) {
    // zero the miles before adding all the miles from entries
    let totalMiles = 0
    // sorting entries by date, starting with most recent
    const entries = Object.entries(snapshot.val())
    const sorted = entries.sort(function(a, b) {
      let dateA = new Date(a[1].date)
      let dateB = new Date(b[1].date)
      return dateB - dateA
    })
    // clear table before adding each entry, so as to not repeat
    statsEl.innerHTML = ""
  for (let entry of sorted) {
    let entryId = entry[0]
    const date = entry[1].date.split('').slice(5).join('')
    const laps = Number(entry[1].laps).toFixed(1)
    const miles = Number(entry[1].miles).toFixed(1) 
    totalMiles += Number(miles)
    // creating a DOM element to insert in the table
    const dailyEntry = document.createElement("tr")
    dailyEntry.setAttribute("class", "daily-stat")
    dailyEntry.setAttribute("id", entryId)
    dailyEntry.classList.add("highlight")
    dailyEntry.innerHTML = `
    <td>${date}</td>
    <td>${laps}</td>
    <td>${miles}</td>
    `
    statsEl.appendChild(dailyEntry)
    setTimeout(() => {
      dailyEntry.classList.remove('highlight');
  }, 2000);
    // adding functionality to delete an entry
    let exactLocationInDb = ref(db, `users/${auth.currentUser.uid}/lapsRef/${entryId}`)
    // mouse event
    dailyEntry.addEventListener("dblclick", deleteEntry)
    // touch event
    dailyEntry.addEventListener('touchstart', function(event) {
      // Start a timer to detect a long press
      const timer = setTimeout(() => {
        // Do something on long press
        deleteEntry();
      }, 500);
      // Clear the timer if the touch ends before the long press is detected
      dailyEntry.addEventListener('touchend', function(event) {
        clearTimeout(timer);
      });
      // need an event for keyboard... maybe a button is a better solution
    });

    function deleteEntry() {
      if (confirm("do you want to delete?")) {
        remove(exactLocationInDb)
      }
    }
  }
  set(userTotalInDb, totalMiles)
  .then(() => {
    totalEl.textContent = totalMiles.toFixed(1)
    })
  })
}
  
function clearInputField(field) {
    field.value = ""
}

function resetForm() {
    clearInputField(dateEl)
    clearInputField(poolNameEl)
    clearInputField(lapEl)
    dateEl.value = formattedDate
    poolNameEl.value = "select"
}

function resetOtherPoolForm() {
  clearInputField(otherPoolName)
  clearInputField(distance)
  units.value = "Yards"
}