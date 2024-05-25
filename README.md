# BeatMaker
Make beats easily online: no installation needed.

**For this website to function properly, open it on a Chromium browser.**

**Project Demo:** https://ericvo.pythonanywhere.com

![brave_screenshot_ericvo pythonanywhere com](https://github.com/eric-vo/beat-maker/assets/99783770/f93303fd-30f1-40d4-812d-d23d13f38992)

## How to Run:
1. Ensure you have Python installed. If you don't, get it [here.](https://www.python.org/downloads/)
2. Clone this repository.
3. Open your terminal and navigate to the newly cloned repository.
4. Run `pip install -r requirements.txt` in your terminal.
5. Run `python manage.py makemigrations beats` in your terminal.
6. Run `python manage.py migrate` in your terminal.
7. Run `python manage.py runserver` in your terminal.


## Files Created / Modified from Default:
- `README.md`: Information about the overall project.
- `requirements.txt`: Required libraries for the website to function.
- `.gitignore`: Directories and files to avoid committing to the repository.

### `beat_maker/`:
- `settings.py`: The project's settings, including the added main app and modified login URL.
- `urls.py`: Code containing the main app's routes and admin route.

### `beats/`:
- `models.py`: Code containing the `Beat` model to store users' beats.
- `urls.py`: Code containing the website's routes.
- `views.py`: Code specifying how to respond to and render pages for each route visited.


### `beats/static/beats/`:
- `favicon.ico`: The website's favicon.
- `kick.wav`: A kick sound.
- `snare.wav`: A snare sound.
- `clap.wav`: A clap sound.
- `hat.wav`: A hi-hat sound.
- `metronome.wav`: A metronome click sound.
- `styles.css`: Code to style the website's elements.
- `create.js`: Code to enable creating, loading, and tracking beats at the `/create` route.
- `beats.js`: Code to enable copying links and deleting beats at the `/beats` route.
- `login.js`: Code to update the `next` parameter of the register link at the `/login` route.
- `register.js`: Code to update the `next` parameter of the login link at the `/register` route.

### `beats/templates/beats/`:
- `layout.html`: A base page that all other pages are built from.
- `index.html`: The home page located at the `/` route.
- `create.html`: The beat-making page located at the `/create` route.
- `beats.html`: The page showing the user's saved beats located at the `/beats` route.
- `login.html`: The login page located at the `/login` route.
- `register.html`: The registration page located at the `/register` route.
