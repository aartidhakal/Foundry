# Foundry

**Smart manufacturing analytics & predictive maintenance.**

Foundry is a project I've been building to learn full-stack development properly, end to end. The idea behind it: factory machines constantly give off sensor data – temperature, vibration, pressure, rpm – and if you watch that data closely, you can often catch a machine going bad before it actually breaks down. Foundry collects those readings, runs them through a model that scores how likely each machine is to fail, and shows the whole picture on a dashboard so maintenance can happen on a schedule instead of in a panic.

I called it Foundry because a foundry is where raw material gets shaped into something useful, which felt about right for a tool that turns raw sensor data into decisions.

It's still a work in progress – the backend and the model work, and I'm currently redesigning the frontend.

## Stack

Python and Flask for the API, scikit-learn for the model, SQLite for storage, and React on the front end. Charts are done with Recharts.

## How it fits together

The React app talks to a Flask API over HTTP. Flask reads from the SQLite database and the trained model, and sends back JSON. Nothing fancy, but it's a clean separation and it made the whole thing much easier to reason about while I was building it.

## The model

It's a Random Forest classifier. Rather than feeding it raw sensor values, I calculate features over a rolling window for each sensor – the mean, spread, min, max, and how fast the values are trending and accelerating. That's what actually carries the signal, because failures tend to show up as gradual drift rather than one dramatic spike. The trained model gets saved to disk (`model.pkl`) and loaded by the API to make predictions on request.

One honest caveat: the data is synthetic for now, generated in `database.py`. Getting hold of real sensor data was out of scope, but the code doesn't care where the readings come from, so swapping in a real feed later wouldn't mean rewriting things.

## API

A few endpoints:

- `GET /machines` – list the machines
- `GET /readings` – sensor readings, optionally filtered by machine
- `GET /maintenance` – maintenance history
- `POST /predict` – risk prediction for a machine
- `GET /health` – quick check that the API is up

## Running it

You'll need Python and Node installed.

Backend:

```
cd backend
pip install flask flask-cors pandas numpy scikit-learn
python database.py
python ml_model.py
python app.py
```

The first two lines only need running once – they build the database and train the model. `app.py` starts the API on port 5000.

Frontend:

```
cd frontend
npm install
npm start
```

That runs on port 3000. Both need to be running at the same time, since the frontend expects the API on 5000.

## What's left

The core works. Things I still want to do: finish the frontend redesign, deal with the class imbalance in the model (accuracy looks fine but recall is weak, which matters for something that's meant to catch failures), and eventually deploy it somewhere.

## About

Built by Aarti Dhakal, Computer Science student at Anglia Ruskin University.
[GitHub](https://github.com/aartidhakal) · [LinkedIn](https://www.linkedin.com/in/aartidhakal/)
