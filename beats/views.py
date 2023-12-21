from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import Beat


# Create your views here.
def index(request):
    return render(request, "beats/index.html")


def create(request):
    tempo = request.GET.get("t")
    metronome = request.GET.get("m")

    # Pattern is set in create.js

    return render(
        request,
        "beats/create.html",
        {
            "range": range(16),
            "tempo": tempo,
            "metronome": metronome,
        },
    )


@login_required
def beats(request):
    return render(request, "beats/beats.html")


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
        return HttpResponseRedirect(reverse("create"))

    return render(request, "beats/register.html")
