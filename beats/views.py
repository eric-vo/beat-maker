from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, Paginator
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import Beat

MAX_NAME_LENGTH = 128
MIN_TEMPO = 50
MAX_TEMPO = 200
DEFAULT_TEMPO = 120
PATTERN_LENGTH = 16
DEFAULT_PATTERN = "0" * 16

BEATS_PER_PAGE = 3


# Create your views here.
def index(request):
    return render(request, "beats/index.html")


def create(request):
    name = request.GET.get("n")
    tempo = request.GET.get("t")
    metronome = request.GET.get("m")
    # Pattern is set in create.js

    if request.method == "POST" and request.user.is_authenticated:
        pattern = request.GET.get("p")

        error_message = None

        # Name validation
        if name is None or len(name) > MAX_NAME_LENGTH:
            error_message = "Name must be between 1 and 128 characters."

        # Pattern validation
        if pattern is None:
            pattern = DEFAULT_PATTERN
        else:
            try:
                int(pattern, 16)
                if len(pattern) != PATTERN_LENGTH:
                    raise ValueError
            except ValueError:
                error_message = "Invalid pattern."

        # Tempo validation
        if tempo is None:
            tempo = DEFAULT_TEMPO
        else:
            try:
                tempo = int(tempo)
                if tempo < MIN_TEMPO or tempo > MAX_TEMPO:
                    raise ValueError
            except ValueError:
                error_message = "Invalid tempo."

        if error_message is not None:
            return render(
                request,
                "beats/create.html",
                {
                    "range": range(PATTERN_LENGTH),
                    "error_message": error_message,
                },
                status=400,
            )

        beat = Beat(
            creator=request.user,
            name=name,
            pattern=pattern,
            tempo=tempo,
            metronome_on=(metronome.lower() == "true")
            if metronome is not None
            else False,
        )
        beat.save()

        return HttpResponseRedirect(reverse("beats"))

    return render(
        request,
        "beats/create.html",
        {
            "range": range(PATTERN_LENGTH),
            "name": name,
            "tempo": tempo,
            "metronome": metronome.lower() if metronome is not None else None,
        },
    )


@login_required
def beats(request):
    return render_beats_page(request, 1, False)


@login_required
def beats_page(request, page):
    return render_beats_page(request, page)


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)

            try:
                return HttpResponseRedirect(request.GET["next"])
            except KeyError:
                return HttpResponseRedirect(reverse("create"))
        else:
            return render(
                request,
                "beats/login.html",
                {"message": "Invalid username and/or password."},
            )

    return render(request, "beats/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if None in (username, password):
            return render(
                request,
                "beats/register.html",
                {"message": "Username and password cannot be blank."},
            )

        if password != confirmation:
            return render(
                request,
                "beats/register.html",
                {"message": "Passwords must match."},
            )

        try:
            user = User.objects.create_user(username, password=password)
            user.save()
        except IntegrityError:
            return render(
                request,
                "beats/register.html",
                {"message": "Username already taken."},
            )

        login(request, user)

        try:
            return HttpResponseRedirect(request.GET["next"])
        except KeyError:
            return HttpResponseRedirect(reverse("create"))

    return render(request, "beats/register.html")


def render_beats_page(request, page, numbered_page=True):
    if page == 1 and numbered_page:
        return HttpResponseRedirect(reverse("beats"))

    paginator = get_beats_paginator(request)
    beats_page = get_beats_page(page, paginator)

    if beats_page is None:
        return render(
            request,
            "beats/beats.html",
            {"page_error": "Page not found."},
            status=404,
        )

    if request.method == "POST" and request.user.is_authenticated:
        try:
            beat = Beat.objects.get(
                pk=request.POST["id"], creator=request.user
            )
            beat.delete()
        except Beat.DoesNotExist:
            return render(
                request,
                "beats/beats.html",
                {
                    "beats": beats_page.object_list,
                    "page": page,
                    "page_range": paginator.page_range,
                    "has_next_page": beats_page.has_next(),
                    "has_previous_page": beats_page.has_previous(),
                    "error_message": "Invalid beat ID.",
                },
                status=400,
            )

        paginator = get_beats_paginator(request)
        beats_page = get_beats_page(page, paginator)

        if beats_page is None:
            return HttpResponseRedirect(reverse("beats", args=(page - 1,)))

        return render(
            request,
            "beats/beats.html",
            {
                "beats": beats_page.object_list,
                "page": page,
                "page_range": paginator.page_range,
                "has_next_page": beats_page.has_next(),
                "has_previous_page": beats_page.has_previous(),
                "success_message": f"Deleted <strong>{beat.name}</strong>!",
            },
        )

    return render(
        request,
        "beats/beats.html",
        {
            "beats": beats_page.object_list,
            "page": page,
            "page_range": paginator.page_range,
            "has_next_page": beats_page.has_next(),
            "has_previous_page": beats_page.has_previous(),
        },
    )


def get_beats_paginator(request):
    beats = request.user.beats.all()
    return Paginator(tuple(reversed(beats)), BEATS_PER_PAGE)


def get_beats_page(page, paginator):
    try:
        beats_page = paginator.page(page)
        return beats_page
    except EmptyPage:
        return None
