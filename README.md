# Axolotl Mileage
## Keep track of the distance you swim

## Why I built this app
I set a goal of swimming 100 miles (in total) in 2024. I wanted to create a (web) app that could convert the number of laps I would be swimming to miles, and keep a running total. This app has been for my personal use only, thusfar. Other people can use it now and they are able to select a pool from a list - but currently these are pools that I swim at in Austin, TX. There is an option to manually enter the pool name and the pool length to track laps though.

## Technology I used
I created this app with Vite, vanilla JavaScript, and Firebase's Realtime Database with authentication. This was my first time building an app from scratch using Firebase, and I wanted to keep things simple.

## What I learned
I learned a lot about how to structure and access data using Firebase. This is actually the second version of the app, as the first time I did not have authentication. I realized that if I were to share the app with anyone, they would not be able to create their own records and could potentially change mine. I decided to create a new Realtime Database, add authentication, and restructure the data so that each user could track their own swimming and keep track of the miles they have swum.
This is the first time I have used HTML tables. Web accessibility is a priority for me, and I realized the most accessible way to display data would be with tables, rather than flexbox or grid. I learned that tables are not necessarily the easiest to style, and this is something I want to tweak at a later date. Right now, the user has to scroll through all the records to see their total.

## Features I'd like to add
There are so many! I want to restyle the table. I want users to be able to sign up/sign in with email (not just Google). I'd like to add functionality to filter the records, to see totals for a week or a month, or a custom time period. Right now, pool name is not displayed in the table. I had thought about having an expanded view with this information. I also thought about connecting to a weather API, so one could see what the high and low temperatures for a particular date were. (I swim in outdoor pools in Austin year-round, and I've done my laps when the temperatures are in the low 40s all the way to the 90s (and before long temps will be in the 100s).) It might be cool to have a photo gallery... the list of features could go on and on. Right now the app is functional and I'm happy with that.

## Challenges
One challenge is finding the time to work on this app. Between work, family, downtime, and - of course - swimming, this hasn't been something I can work on every day or every week. I have gotten stuck numerous times while working on this app, and had a few mishaps. Once - pretty early on in the year thankfully - I was trying to add functionality to delete a record and inadvertently deleted all the records. Fortunately I still had a `data.js` file where I had been entering records manually at first. I was able to add all the records back. One blocker I couldn't get past was user authentication with Firebase and email sign-up/login. It was holding me up too much, so I decided that auth with Google sign-in is fine for now and I can come back to other sign-in methods later. 

