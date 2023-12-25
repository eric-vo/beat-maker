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


## Files Created/Modified:
- `README.md`: Information about the overall project.
- `requirements.txt`: Required libraries for the website to function.
- `.gitignore`: Directories and files to avoid committing to the repository.

### `beat_maker/`:
- `settings.py`: The project's settings, including the added main app and modified login URL.
- `urls.py`: Code containing the main app's routes and the admin route.

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

### `beats/templates/beats/`:
- `layout.html`: A base page that all other pages are built from.
- `index.html`: The home page located at the `/` route.
- `create.html`: The beat-making page located at the `/create` route.
- `beats.html`: The page showing the user's saved beats located at the `/beats` route.
- `login.html`: The login page located at the `/login` route.
- `register.html`: The registration page located at the `/register` route.


## Distinctiveness and Complexity:
This project is sufficiently distinct from the other projects in this course because this project focuses on music, which is unseen in other projects. This project is the only project in this course to utilize played sounds as the primary focus, using JavaScript to play each sound according to which notes the user fills in. Additionally, the beats in this project depend on time-based elements, such as beat numbers and tempo, which the other, mainly text-based projects, do not have.

This project is more complex than the other projects in this course because of the URL and pattern manipulation required to make it function. With every adjustable parameter, the code must modify the URL to store each parameter whenever the user edits a beat; this allows for sharing and loading beats just by sharing a link. In addition, the project code has to enable loading beats from these URL parameters, which requires strategic looping through notes to fill them in and play them later. A notable element is the pattern URL parameter (`p`), which uses hexadecimal characters to store the note data of each column in the beat. To decode this pattern ID, each character must be converted into a four-character binary string, with each bit representing the state of each note in the column. To assemble the pattern ID again when the beat is updated, the opposite needs to happen.
