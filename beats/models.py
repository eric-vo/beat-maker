from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Beat(models.Model):
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="beats"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    pattern = models.CharField(max_length=16)
    tempo = models.IntegerField()
    metronome_on = models.BooleanField()
