# BeatMaker
**Make beats easily online: no install needed.**

This is my final project for [CS50’s Web Programming with Python and JavaScript.](https://cs50.harvard.edu/web)


## How to Run:
1. Ensure you have Python installed. If you don't, get it [here.](https://www.python.org/downloads/)
2. Clone this repository.
3. Open your terminal and navigate to the newly cloned repository.
4. Run `pip install -r requirements.txt` in your terminal.
5. Run `python manage.py makemigrations` in your terminal.
6. Run `python manage.py migrate` in your terminal.
7. Run `python manage.py runserver` in your terminal.


## File Descriptions:
- `README.md`: Information about the overall project.
- `requirements.txt`: Required libraries for the website to function.
- `.gitignore`: Directories and files to avoid committing to the repository.

### `beats/`:
- `urls.py`: Code containing all of the website's routes.

### `beats/static/beats/`:
- `favicon.ico`: The website's favicon.
- `kick.wav`: A kick sound.
- `snare.wav`: A snare sound.
- `clap.wav`: A clap sound.
- `hat.wav`: A hi-hat sound.
- `metronome.wav`: A metronome click sound.
- `styles.css`: Code to style the website's elements.
- `create.js`: Code to enable creating, loading, and tracking beats at the `/create` route.

### `beats/templates/beats/`:
- `layout.html`: A base page that all other pages are built from.
- `index.html`: The home page located at the `/` route.
- `create.html`: The beat-making page located at the `/create` route.
- `beats.html`: The page showing the user's saved beats located at the `/beats` route.
- `login.html`: The login page located at the `/login` route.
- `register.html`: The registration page located at the `/register` route.


## Distinctiveness and Complexity:
WIP
