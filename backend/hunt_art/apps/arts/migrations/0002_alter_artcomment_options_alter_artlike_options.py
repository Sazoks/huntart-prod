# Generated by Django 5.0.2 on 2024-03-08 07:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("arts", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="artcomment",
            options={"verbose_name": "Коментарий", "verbose_name_plural": "Коментарии"},
        ),
        migrations.AlterModelOptions(
            name="artlike",
            options={"verbose_name": "Лайк", "verbose_name_plural": "Лайки"},
        ),
    ]
